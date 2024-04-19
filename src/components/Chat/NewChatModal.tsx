import React, { useState } from "react";
import styled from "styled-components";
import { GrClose } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";

// 빽그라운드
const NCMBackground = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

// 모달창   New Chat Modal  /  새 채팅 누르면 뜨는 창
const NCMContainer = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 500px;
  height: 500px;
  padding: 20px 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

// 모달창에서 위에 이름이랑 X표 있는곳
const NCMHeader = styled.div`
  height: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px 20px 10px;
`;

const NCMMyName = styled.div`
  font-weight: bold;
`;

const CloseIcon = styled.div`
  display: flex;
  align-items: center;
  margin-left: 190px;
  &:hover {
    cursor: pointer;
  }
`;

const CloseIconImg = styled(GrClose)`
  font-size: 1.5rem;
  color: #64748b;
`;

// 모달창 중간 팔로우 팔로워 부분
const NCMFollowBox = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const NCMFollower = styled.div`
  width: 250px;
  // color: true ? black : #cbd5e6;
  border-bottom: 2px solid #cbd5e6;

  &:hover {
    cursor: pointer;
  }
`;

const NCMFollowing = styled.div`
  width: 250px;
  color: #cbd5e6;
  border-bottom: 2px solid #cbd5e6;
`;

/////

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
  color: #64748b;
`;

const MLMFollowBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: #f8fafc;
  }
`;

const MLMFollowDiv = styled.div`
  height: 50px;
  display: flex;
  justify-content: center;
  aligncontent: center;
`;

const MLMFollowButton = styled.button`
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  background-color: #e2e8f0;
  outlind: none;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
  }
`;

interface ChatContentModalProps {
  show: boolean;
  close: () => void;
}

const ChatContentModal: React.FC<ChatContentModalProps> = ({ show, close }) => {
  const [selectedFollower, setSelectedFollower] = useState("false");
  const [selectedFollowing, setSelectedFollowing] = useState("true");

  return (
    <>
      <NCMBackground show={show} onClick={close} />
      <NCMContainer show={show}>
        <NCMHeader>
          <NCMMyName>윤승현</NCMMyName>
          <CloseIcon onClick={close}>
            <CloseIconImg />
          </CloseIcon>
        </NCMHeader>

        <NCMFollowBox>
          <NCMFollower>
            <div className="follow-style">팔로워</div>
            <div className="follow-style">2</div>
          </NCMFollower>
          <NCMFollowing>
            <div className="follow-style">팔로잉</div>
            <div className="follow-style">22</div>
          </NCMFollowing>
        </NCMFollowBox>

        <MLMFollowBottom>
          <div className="follow-lists">
            <MLMProfileImg>
              <CgProfile className="Profile-image" />
            </MLMProfileImg>
            <MLMProfileInfo>
              <div className="column-div">
                <MLMProfileName>김학준</MLMProfileName>
                <MLMProfileDate>프론트</MLMProfileDate>
              </div>
            </MLMProfileInfo>
          </div>
          <MLMFollowDiv>
            <MLMFollowButton>팔로우</MLMFollowButton>
          </MLMFollowDiv>
        </MLMFollowBottom>
      </NCMContainer>
    </>
  );
};

export default ChatContentModal;
