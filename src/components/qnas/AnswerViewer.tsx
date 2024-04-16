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
  commenterId: number; //댓글자 유저 아이디 번호
  commenter: string;
  createdAt: string;
  updatedAt: string;
  answerId?: number; //answerId속성을 선택적으로 만듬
}

interface Answers {
  id: number; //답변글 id (questionId, 하향식);
  content: string; //답변내용
  answerId: number; //답변번호
  questionId: number; //답변이 어떤 질문에 대한 답변인지.질문글id
  userId: number; //답변자id
  username: string; //답변자 닉네임
  createdAt: string;
  updatedAt: string;
  likeCount: number;

  answerComments: Comments[];
  liked: boolean | null;
}

interface AnswerViewerProps {
  loggedIn: Boolean;
  loggedInUserId: number | null;
  answers: Answers[];
  questionerId: number;
}

const AnswerViewer: React.FC<AnswerViewerProps> = ({
  loggedIn,
  loggedInUserId,
  answers,
  questionerId,
}) => {
  //추후 수정 필요
  const apiUrl = "";

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /////코멘트 (댓글) 관련/////

  //모든 답변의 코멘트들을 합친 배열을 펼쳐서 초기값으로 설정. 각 comment객체에 answerId값을 추가. 어떤 답변에 대한 코멘트인지 알 수 있게
  const initialComments: Comments[] = answers.flatMap((answer) =>
    answer.answerComments.map((comment) => ({
      ...comment,
      answerId: answer.id,
    }))
  );

  const [comments, setComments] = useState<Comments[]>(initialComments);

  //null값이면 댓글쓰기 창 닫히고 answer.answerId값이 들어오면 해당 답변의 댓글쓰기 창이 열림
  const [isCommentBtnClicked, setIsCommentBtnClicked] = useState<number | null>(
    null
  );
  const [commentButtonStates, setCommentButtonStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [content, setContent] = useState("");
  const [isContentPresent, setIsContentPresent] = useState(false);

  /////날짜, 시간 포멧팅/////
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
  const [liked, setLiked] = useState<boolean | null>(null);
  // interface LikeStatus {
  //   [key: number]: number;
  // }

  // const initialLikeStatus = answers.reduce((acc, curr) => {
  //   acc[curr.id] = curr.userLikeStatus;
  //   return acc;
  // }, {} as LikeStatus);

  // interface LikeCount {
  //   [key: number]: number;
  // }

  // const [likeCount, setLikeCount] = useState(0);

  // // 서버에서 받아온 좋아요 수를 사용하여 초기값 설정
  // const initialLikeCount = answers.reduce((acc, curr) => {
  //   acc[curr.id] = curr.likeCount;
  //   return acc;
  // }, {} as LikeCount);

  // // 좋아요 수를 서버에서 받아온 값으로 설정

  // const [likeStatus, setLikeStatus] = useState(initialLikeStatus);

  // const likeClickHandler = (answerId: number) => {
  //   setLikeCount(initialLikeCount[answerId]);
  //   const clickedAnswer = answers.find((answer) => answer.id === answerId);
  //   if (clickedAnswer) {
  //     const userLikeStatus = clickedAnswer.userLikeStatus;

  //     if (loggedIn) {
  //       const updatedLikeStatus = { ...likeStatus }; // 현재 likeStatus 상태를 복사
  //       if (userLikeStatus === 0) {
  //         updatedLikeStatus[answerId] = 1; // 좋아요 상태를 업데이트
  //         setLikeCount((prevCount) => prevCount + 1); // 좋아요 수를 증가
  //       } else if (userLikeStatus === 1) {
  //         updatedLikeStatus[answerId] = 0; // 좋아요 상태를 업데이트
  //         setLikeCount((prevCount) => prevCount - 1);
  //         console.log("되나?"); // 좋아요 수를 감소
  //       }

  //       // 서버에 요청 보내기
  //       axios
  //         .post(`${apiUrl}`, {
  //           userId: userId,
  //           answerId: answerId,
  //           userLikeStatus: updatedLikeStatus[answerId], // 업데이트된 좋아요 상태 전송
  //         })
  //         .then((response) => {
  //           console.log("답변 좋아요 요청이 성공했습니다");
  //         })
  //         .catch((error) => {
  //           console.error("답변 좋아요 요청이 실패했습니다:", error);
  //         });

  //       // 업데이트된 좋아요 상태를 저장
  //       setLikeStatus(updatedLikeStatus);
  //     }
  //   }
  // };

  const commentButtonClickHandler = (answerId: number) => {
    setIsCommentBtnClicked((prevState) =>
      prevState === answerId ? null : answerId
    );
    setCommentButtonStates((prevState) => ({
      ...prevState,
      [answerId]: !prevState[answerId], // 해당 answerId에 대한 상태를 토글
    }));
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
                <span className="answer-viewer-header-user-photo">
                  <PiUserCircle />
                </span>
                <div className="answer-header-block">
                  <div className="user-info">
                    <div>{answer.username}</div>
                    {questionerId == answer.userId && (
                      <div className="author-badge-container">
                        <div className="author-badge">
                          <div className="author-text">작성자</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="user-date-text">
                    {formattedDateYYMMDD(answer.createdAt)}.
                    {formattedTimeHHMM(answer.createdAt)}
                  </div>
                </div>

                {loggedIn && loggedInUserId === answer.userId && (
                  <div className="answer-delete-btn-container">
                    <button className="answer-delete-btn">삭제</button>
                  </div>
                )}
              </div>

              <div className="answer-content">{answer.content}</div>
              <div className="answer-viewer-footer">
                <button className="like-button">
                  <span>{liked ? <AiFillLike /> : <AiOutlineLike />}</span>
                  <div>좋아요</div>
                  {/* <div>{likeStatus[answer.id]}</div> */}
                </button>
                <button
                  className="reply-button"
                  onClick={() => {
                    commentButtonClickHandler(answer.answerId);
                  }}
                >
                  <span>
                    <BiCommentDots />
                  </span>
                  <div>댓글</div>
                  <div>{answer.answerComments.length}</div>
                </button>
              </div>
            </div>
            {/* 여기여기여기여기여ㅣ여깅 return point */}
            {isCommentBtnClicked === answer.answerId && (
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
                  comment.answerId == answer.answerId && (
                    <div className="comment-view-container" key={comment.id}>
                      <div className="comment-viewer-header">
                        <span>
                          <PiUserCircle />
                        </span>
                        <div className="user-date-info">
                          <div className="user-badge-container">
                            <div>{comment.commenter}</div>
                            {comment.commenterId == questionerId && (
                              <div className="author-badge-container-2">
                                <div className="author-badge-2">
                                  <div className="author-text-2">작성자</div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="user-date-text">
                            {formattedDateYYMMDD(comment.createdAt)}.
                            {formattedTimeHHMM(comment.createdAt)}
                          </div>
                        </div>

                        {loggedIn && loggedInUserId === comment.commenterId && (
                          <div className="comment-delete-btn-container">
                            <button>삭제</button>
                          </div>
                        )}
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
