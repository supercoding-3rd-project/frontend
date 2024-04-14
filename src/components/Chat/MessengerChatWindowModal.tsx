import React from "react";
import styled from "styled-components";
import MyChatDummy from "./MyChatDummy";
import axios from "axios";

// 채팅창
const CWMContainer = styled.div<{ windowshow: boolean }>`
  width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  border-right: 1px solid #e2e8f0;
`;

const CWMHeader = styled.div`
  width: 600px;
  height: 50px;
`;

const CWMChatContent = styled.div`
  width: 600px;
  height: 615px;
`;

const ImsiDiv = styled.div`
  width: auto;
  height: auto;
  border: 1px solid #e6ebf2;
  padding: 15px;
  background-color: yellow;
`;

interface Props {
  windowshow: boolean;
}

const MessengerChatWindowModal: React.FC<Props> = ({ windowshow }) => {
  return (
    <CWMContainer windowshow={windowshow}>
      <CWMHeader>친구1(props)</CWMHeader>
      {/* ^^^ 채팅창 상단 바 */}
      <CWMChatContent>
        <채팅 />
      </CWMChatContent>
      {/* ^^^ 채팅내역 */}
    </CWMContainer>
  );
};

MessengerChatWindowModal.defaultProps = {
  windowshow: false,
};

//////////////// 밑에 개개인 채팅창

const CWMChatBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center; /////
`;

const 채팅: React.FC = () => {
  return (
    <CWMChatBox>
      {MyChatDummy.map((chat) => (
        <div key={chat.id}>
          <div>{chat.content}</div>
          <div>{chat.date}</div>
        </div>
      ))}
    </CWMChatBox>
  );
};

export default MessengerChatWindowModal;

// <button
// onClick={() => {
//   axios
//     .get("https://codingapple1.github.io/shop/data2.json")
//     .then((res) => {
//       console.log(res.data);
//     })
//     .catch(() => {
//       console.log("에러뜸");
//     });
// }}
// >
// 그버튼
// </button>
