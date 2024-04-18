import React, { useRef, useState } from "react";
import "./answerEditor.scss";
import { PiUserCircle } from "react-icons/pi";
import { PiCodeBlockBold } from "react-icons/pi";

const AnswerEditor = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeboxTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCodeBoxBtnClicked, setIsCodeBoxBtnClicked] = useState(false);
  const [content, setContent] = useState("");
  const [isContentPresent, SetIsContentPresent] = useState(false);
  const [codeboxContent, setCodeboxContent] = useState("");

  const combinedHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleResizeHeight();
    contentChangeHandler(event);
  };

  //resize answer textarea
  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const contentChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newContent = event.target.value;
    setContent(newContent);
    SetIsContentPresent(newContent.trim() != "");
  };

  const codeboxCombinedHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleResizeCodeboxHeight();
    codeboxContentChangeHandler(event);
  };

  //resize codebox textarea
  const handleResizeCodeboxHeight = () => {
    if (codeboxTextareaRef.current) {
      codeboxTextareaRef.current.style.height = "auto";
      codeboxTextareaRef.current.style.height =
        codeboxTextareaRef.current.scrollHeight + "px";
    }
  };

  const codeboxContentChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCodeboxContent(event.target.value);
  };

  const getButtonClassName = () => {
    return isContentPresent ? "btn-enabled" : "btn-disabled";
  };

  const codeboxBtnClickHandler = () => {
    setIsCodeBoxBtnClicked((prevState) => !prevState);
  };

  const submitClickHandler = () => {
    console.log(content);
    console.log(codeboxContent);
  };

  return (
    <div className="answer-editor-layout">
      <div className="answer-container">
        <div className="answer-container-left">
          <span>
            <img
              className="answerer-profile-img"
              src="/images/profile_default.png"
              alt=""
            />
          </span>
        </div>
        <div className="answer-container-right">
          <div className="answer-text">답변하기</div>
          <textarea
            className="text-textarea"
            onChange={combinedHandler}
            ref={textareaRef}
            placeholder="답변으로 나누고 싶은 경험이 있으신가요?"
          />
          {isCodeBoxBtnClicked ? (
            <div className="codebox-container">
              <select defaultValue="JavaScript">
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="C#">C#</option>
                <option value="CSS">CSS</option>
                <option value="Dart">Dart</option>
                <option value="Go">Go</option>
                <option value="HTML">HTML</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Kotlin">Kotlin</option>
                <option value="Matlab">Matlab</option>
                <option value="Objective-C">Objective-C</option>
                <option value="PHP">PHP</option>
                <option value="Python">Python</option>
                <option value="R">R</option>
                <option value="Ruby">Ruby</option>
                <option value="Rust">Rust</option>
                <option value="Scala">Scala</option>
                <option value="SQL">SQL</option>
                <option value="Swift">Swift</option>
                <option value="TypeScript">TypeScript</option>
              </select>
              <div className="codebox-textarea-wrapper">
                <textarea
                  className="codebox-textarea"
                  onChange={codeboxCombinedHandler}
                  ref={codeboxTextareaRef}
                  placeholder="코드를 추가해주세요"
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="btn-wrapper">
            <button className="codebox-btn" onClick={codeboxBtnClickHandler}>
              <PiCodeBlockBold />
            </button>
            <button
              className={`reply-submit-btn ${getButtonClassName()}`}
              onClick={submitClickHandler}
              disabled={!isContentPresent}
            >
              답변등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerEditor;
