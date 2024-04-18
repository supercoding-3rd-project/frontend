import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import "./CSS/MessengerLeftModal.css";

// 메신저 왼쪽 모달창/  Messenger Left Modal

const MLMContainer = styled.div`
  width: 360px;
  height: 90px;
  display: flex;
  justify-content: start;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: #f8fafc;
  }
`;

const MLMProfileImg = styled.div`
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MLMProfileInfo = styled.div`
  width: 270px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`;

const MLMProfileName = styled.div`
  height: 20px;
`;

const MLMProfileDate = styled.div`
  height: 20px;
  margin-left: 10px;
  color: #64748b;
`;

type ModalProps = {
  chat: {
    onClick: Function;
    roomId: number;
    id: number;
    name: string;
    date: string;
    content: string;
  };
};

const MessengerLeftModal: React.FC<ModalProps> = ({ chat }) => {
  return (
    <MLMContainer
      onClick={() => {
        chat.onClick();
      }}
    >
      <MLMProfileImg>
        <CgProfile className="Profile-image" />
      </MLMProfileImg>
      <MLMProfileInfo>
        <div className="row-div">
          <MLMProfileName>채팅방 {chat.roomId}</MLMProfileName>
          <MLMProfileDate>{chat.date}</MLMProfileDate>
        </div>
        <div>{chat.content}</div>
      </MLMProfileInfo>
    </MLMContainer>
  );
};

export default MessengerLeftModal;
