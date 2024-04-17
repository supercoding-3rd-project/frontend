import React, { useState, useEffect } from "react";
import MessengerLeftModal from "./MessengerLeftModal";
import ChatList from "./ChatList";
// import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import "./CSS/Messenger.css";
import { BsEnvelopePlus } from "react-icons/bs";
import { TbTriangleInverted } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import ChatDummy from "./ChatDummy";
import NewChatModal from "./NewChatModal";
import MessengerChatWindowModal from "./MessengerChatWindowModal";

//socket io connect
import io from "socket.io-client";
import { Socket } from "socket.io-client"; // SocketIOClient 타입 가져오기
import { Console } from "console";
const SOCKET_SERVER_URL = "http://52.79.37.99:3001";

const MBackground = styled.div`
  transition: margin-left 0.5s ease;
  width: 960px;
  height: 90vh;
  margin-left: auto;
  margin-right: auto;
  margin-top: 90px;
  margin-bottom: -32px;
  display: flex;
  flex-direction: row;
`;

const MChatList = styled.div`
  width: 360px;
  height: 100vh;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
`;

const MCListHeader = styled.div`
  width: 360px;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MCLHeaderLeft = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatPlusIcon = styled(BsEnvelopePlus)`
  font-size: 1.3rem;
  //&: hover {
  //  cursor: pointer;
  //}
`;

const MCLHeaderRight = styled.div`
  width: 160px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TriangleDownIcon = styled(TbTriangleInverted)`
  font-size: 1rem;
  margin-right: 5px;
`;

const MSearchChatDiv = styled.div`
  width: 360px;
  height: 87px;
  display: flex;
  align-items: center;
  justify-content: center;
  // border: 1px solid   border: 1px solid #e8edf3;
  // border-radius: 15px;
`;

const MSearchChatBox = styled.div`
  width: 330px;
  height: 30px;
  display: flex;
  align-items: center;
  border: 2px solid #e8edf3;
  border-radius: 13px;
`;

const SearchIcon = styled(IoSearch)`
  font-size: 1rem;
  margin: 0 10px;
`;

const MChatModals = styled.div`
  width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
`;

///////////////

const MChatContents = styled.div`
  width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #e2e8f0;
`;

interface Chat {
  onClick: Function;
  roomId: number;
  id: number;
  name: string;
  date: string;
  content: string;
  chats: any;
}

const Messenger: React.FC = () => {
  const [searching, setSearching] = useState(""); ///검색창 인풋태그
  const [isChatModalOpen, setIsChatModalOpen] = useState([]); ///오른쪽 채팅창 띄우기
  // const [임시채팅, set임시채팅] = useState(["여친1", "남친1", "남친2"]);
  // const [추가할내용, set추가할내용] = useState("");
  // const [chatContentModal, SetChatContentModal] = useState(false); /// 새 채팅 시작하기 모달
  const [newChatModal, setNewChatModal] = useState(false); /// 새 채팅 시작하기 모달
  const [showChatWindow, setShowChatWindow] = useState(false); /// 채팅창 여닫기 모달
  const [chatlist, setChatlist] = useState<Chat[]>([]);
  const [currentChats, setCurrentChats] = useState([] as any);
  const openNCModal = () => setNewChatModal(true);
  const closeNCModal = () => setNewChatModal(false);
  const [loginUser, setLoginUser] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const initSocketConnect = (roomId: any) => {
    if (socket != null) {
      socket.disconnect();
    }

    var newSocket = io(SOCKET_SERVER_URL);

    setSocket(newSocket);
    // 연결된 소켓에 대한 이벤트 핸들러 등록
    newSocket.on("connect", () => {
      setLoginUser(newSocket.id == undefined ? "nouser" : newSocket.id);
      console.log("소켓 서버에 연결되었습니다." + newSocket.id);
      newSocket.emit("join", "room" + roomId);
    });

    // 필요에 따라 다른 이벤트 핸들러 등록
    newSocket.on("recv", (data: any) => {
      console.log("새로운 메시지가 도착했습니다:", data);

      var from = data.from;
      var value = data.value;

      //alert(thisRoomId)
      //chatlist 업데이트
      var room = chatlist.find((room) => room.roomId == roomId);

      var newChats = {
        user: from,
        content: value,
        time: new Date().toISOString(),
      };
      // 새로운 메시지 추가하거나 수정된 메시지 내용 등을 업데이트
      if (room && room != undefined) {
        room.chats.push(newChats);
        setCurrentChats(currentChats.concat(room.chats));
      }
    });

    return () => {
      // 컴포넌트가 언마운트되면 소켓 연결 해제
      newSocket.disconnect();
    };
  };

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Regulus55/ChatDummy/main/ChatDummy.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setChatlist(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  function handleSend(message: any) {
    if (socket) {
      socket.emit("msg", { from: loginUser, value: message });
    }
  }

  return (
    <MBackground>
      {/* 최상단 콘테이너 */}
      <MChatList>
        {/* 왼쪽 채팅리스트 */}
        <MCListHeader>
          <MCLHeaderLeft>
            <h4>채팅</h4>
          </MCLHeaderLeft>
          <MCLHeaderRight>
            <div className="nosee-chat">
              <TriangleDownIcon />안 읽은 메시지
            </div>
          </MCLHeaderRight>
        </MCListHeader>
        <MSearchChatDiv>
          <MSearchChatBox>
            <SearchIcon />
            <input className="searching-bar" placeholder="이름으로 검색" />
          </MSearchChatBox>
        </MSearchChatDiv>
        <MChatModals>
          {chatlist.map(function (chat) {
            chat.onClick = () => {
              initSocketConnect(chat.roomId);
              //소켓 연결 및 채팅 UI 오픈

              setShowChatWindow(true);
              setCurrentChats(chat.chats);
            };

            return <MessengerLeftModal key={chat.id} chat={chat} />;
          })}

          {/* {chatlist.map((chat) => (
            <MessengerLeftModal key={chat.id} chat={chat} />
          ))} */}
        </MChatModals>
      </MChatList>

      {showChatWindow ? (
        <ChatList chats={currentChats} me={loginUser} onSend={handleSend} />
      ) : (
        <MChatContents>
          <div>
            <img id="smile-icon" src="/웃는아이콘.png" alt="웃는 아이콘" />
          </div>
          <div className="lets-new-chat">새로운 채팅을 시작해보세요!</div>
          <button className="new-chat-button" onClick={openNCModal}>
            채팅 시작하기
          </button>
          <NewChatModal show={newChatModal} close={closeNCModal} />
          {/* ^^^ 새 채팅 시작 모달 */}
        </MChatContents>
      )}
      {/* ^^^ 채팅창 모달 */}
    </MBackground>
  );
};

export default Messenger;
