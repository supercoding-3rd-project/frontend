import React, { useRef, useState } from "react";
import "./answerViewer.scss";
import { PiUserCircle } from "react-icons/pi";
import { BiCommentDots } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import axios from "axios";

interface Comments {
  id: number; //코멘트번호
  content: string;
  commenter: number; //댓글자 유저 아이디 번호
  createdAt: string;
  updatedAt: string;
  answerId?: number; //answerId속성을 선택적으로 만듬
}

interface Answers {
  id: number; //답변id
  title: string;
  content: string;
  answerer: number;
  likeCount: number;
  userLikeStatus: number;
  createdAt: string;
  updatedAt: string;
  comments: Comments[];
}

interface AnswerViewerProps {
  loggedIn: Boolean;
  userId: number;
  answers: Answers[];
}

const AnswerViewer: React.FC<AnswerViewerProps> = ({
  loggedIn,
  userId,
  answers,
}) => {
  //현재 파이어베이스. 추후 수정 필요
  const apiUrl =
    "https://supercoding-3rd-pj-test-default-rtdb.firebaseio.com/.json";

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // 모든 답변의 코멘트들을 합친 배열을 펼쳐서 초기값으로 설정. 각 comment객체에 answerId값을 추가
  const initialComments: Comments[] = answers.flatMap((answer) =>
    answer.comments.map((comment) => ({
      ...comment,
      answerId: answer.id,
    }))
  );

  const [comments, setComments] = useState<Comments[]>(initialComments);

  const [isCommentBtnClicked, setIsCommentBtnClicked] = useState(false);
  const [content, setContent] = useState("");
  const [isContentPresent, setIsContentPresent] = useState(false);

  //날짜, 시간 포멧팅
  const formattedDateYYMMDD = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const formattedTimeHHMM = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // 시간과 분을 두 자리 숫자로 포맷팅
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  };

  //댓글 입력창 높이 자동 조절
  const combindHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleResizeHeight();
    contentChangeHandler(event);
  };

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
      textareaRef.current.style.height =
        textareaRef.current.clientHeight + "px";
    }
  };

  const contentChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newContent = event.target.value;
    setContent(newContent);
    setIsContentPresent(newContent.trim() != "");
  };

  ///답변의 좋아요///
  interface LikeStatus {
    [key: number]: number;
  }

  const initialLikeStatus = answers.reduce((acc, curr) => {
    acc[curr.id] = curr.userLikeStatus;
    return acc;
  }, {} as LikeStatus);

  interface LikeCount {
    [key: number]: number;
  }

  const [likeCount, setLikeCount] = useState(0);

  // 서버에서 받아온 좋아요 수를 사용하여 초기값 설정
  const initialLikeCount = answers.reduce((acc, curr) => {
    acc[curr.id] = curr.likeCount;
    return acc;
  }, {} as LikeCount);

  // 좋아요 수를 서버에서 받아온 값으로 설정

  const [likeStatus, setLikeStatus] = useState(initialLikeStatus);

  const likeClickHandler = (answerId: number) => {
    setLikeCount(initialLikeCount[answerId]);
    const clickedAnswer = answers.find((answer) => answer.id === answerId);
    if (clickedAnswer) {
      const userLikeStatus = clickedAnswer.userLikeStatus;

      if (loggedIn) {
        const updatedLikeStatus = { ...likeStatus }; // 현재 likeStatus 상태를 복사
        if (userLikeStatus === 0) {
          updatedLikeStatus[answerId] = 1; // 좋아요 상태를 업데이트
          setLikeCount((prevCount) => prevCount + 1); // 좋아요 수를 증가
        } else if (userLikeStatus === 1) {
          updatedLikeStatus[answerId] = 0; // 좋아요 상태를 업데이트
          setLikeCount((prevCount) => prevCount - 1);
          console.log("되나?"); // 좋아요 수를 감소
        }

        // 서버에 요청 보내기
        axios
          .post(`${apiUrl}`, {
            userId: userId,
            answerId: answerId,
            userLikeStatus: updatedLikeStatus[answerId], // 업데이트된 좋아요 상태 전송
          })
          .then((response) => {
            console.log("답변 좋아요 요청이 성공했습니다");
          })
          .catch((error) => {
            console.error("답변 좋아요 요청이 실패했습니다:", error);
          });

        // 업데이트된 좋아요 상태를 저장
        setLikeStatus(updatedLikeStatus);
      }
    }
  };

  const commentButtonClickHandler = () => {
    setIsCommentBtnClicked((prevState) => !prevState);
  };

  const submitBtnClickHandler = () => {
    console.log(content);
  };

  return (
    <>
      {answers.length > 0 &&
        answers.map((answer) => (
          <div className="answer-viewer-layout" key={answer.id}>
            <div className="answer-viewer-container">
              <div className="answer-viewer-header">
                <span>
                  <PiUserCircle />
                </span>
                <div className="user-date-info">
                  <div>{answer.answerer}</div>
                  <div>
                    {formattedDateYYMMDD(answer.createdAt)}.
                    {formattedTimeHHMM(answer.createdAt)}
                  </div>
                </div>
              </div>

              <div className="answer-content">{answer.content}</div>
              <div className="answer-viewer-footer">
                <button
                  className="like-button"
                  onClick={() => likeClickHandler(answer.id)}
                >
                  <span>
                    {likeStatus[answer.id] === 1 ? (
                      <AiFillLike />
                    ) : (
                      <AiOutlineLike />
                    )}
                  </span>
                  <div>좋아요</div>
                  <div>{likeStatus[answer.id]}</div>
                </button>
                <button
                  className="reply-button"
                  onClick={commentButtonClickHandler}
                >
                  <span>
                    <BiCommentDots />
                  </span>
                  <div>댓글</div>
                  <div>{answer.comments.length}</div>
                </button>
              </div>
            </div>
            {isCommentBtnClicked && (
              <div className="comment-container">
                <textarea
                  className="comment-textarea"
                  onChange={combindHandler}
                  ref={textareaRef}
                  placeholder="댓글을 남겨주세요"
                ></textarea>
                <div className="button-wrapper">
                  <button
                    className={isContentPresent ? "enabled" : "disabled"}
                    onClick={submitBtnClickHandler}
                    disabled={!isContentPresent}
                  >
                    등록
                  </button>
                </div>
              </div>
            )}
            {comments.length > 0 &&
              comments.map(
                (comment) =>
                  comment.answerId == answer.id && (
                    <div className="comment-view-container">
                      <div className="comment-viewer-header">
                        <span>
                          <PiUserCircle />
                        </span>
                        <div className="user-date-info">
                          <div>{comment.commenter}</div>
                          <div>
                            {formattedDateYYMMDD(comment.createdAt)}.
                            {formattedTimeHHMM(comment.createdAt)}
                          </div>
                        </div>
                        <div className="comment-delete-btn-container">
                          <button>삭제</button>
                        </div>
                      </div>
                      <div className="comment-view-content-box">
                        <div>{comment.content}</div>
                      </div>
                    </div>
                  )
              )}
          </div>
        ))}
    </>
  );
};

export default AnswerViewer;
