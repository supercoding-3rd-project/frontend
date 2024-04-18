import React, { useState, useRef, ChangeEvent } from "react";
import styled from "styled-components";
import { TbPaperclip } from "react-icons/tb";
import { IoSend } from "react-icons/io5";

const StyledClip = styled(TbPaperclip)``;

const StyledSend = styled(IoSend)`
  font-size: 10rem;
`;

interface Chat {
  user: string;
  content: string;
}

interface Props {
  chats: Chat[];
  me: string;
  onSend: (text: string, image: File | null) => void;
}

export default function ChatList({ chats, me, onSend }: Props) {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSend = () => {
    onSend(text, image);
    setText("");
    setImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAttachImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <div
          className="custom-scroll"
          style={{
            height: "76%",
            background: "#ffffff",
            width: "100%",
            marginTop: "100px",
            overflow: "scroll",
            padding: "10px",
          }}
        >
          {chats.map((chat, index) => (
            <div
              key={index}
              className={`msg-box ${chat.user === me ? "right" : "left"}`}
            >
              <div>
                <div className="nick-tag">
                  {chat.user === me ? "나" : chat.user}
                </div>
                <div className="bubble">{chat.content}</div>
              </div>
            </div>
          ))}
        </div>
        <div id="input-box">
          <input
            value={text}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            id="msg-input"
            style={{ width: "87%", height: "80px" }}
            className="form-control"
            type="text"
            placeholder="메시지를 입력해 주세요"
          />

          <input
            ref={fileInputRef}
            type="file"
            id="image-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className="btn btn-dark"
            onClick={handleAttachImage}
          >
            <StyledClip />
          </button>
          <button
            onClick={() => {
              handleSend(); // 버튼 클릭 시 handleSend 호출
            }}
            style={{
              width: "5%",
              height: "20px",
              fontWeight: 700,
            }}
            type="button"
            className="btn btn-dark"
          >
            <StyledSend />
          </button>
        </div>
      </div>
    </>
  );
}
