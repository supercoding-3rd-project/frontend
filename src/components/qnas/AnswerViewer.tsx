import React, { useRef, useState } from "react";
import "./answerViewer.scss";
import { PiUserCircle } from "react-icons/pi";
import { BiCommentDots } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import axios from "axios";
interface Comments {
  commentId: number; //코멘트번호
  content: string;
  commenterId: number; //댓글자 유저 아이디 번호
  commenter: string; //댓글자 닉네임
  profileImage: string;
  canDelete: boolean;
  createdAt: string;
  answerId?: number; //answerId속성을 선택적으로 만듬
}

interface Answers {
  questionId: number; //답변이 어떤 질문에 대한 답변인지.질문글id
  answerId: number; //답변글 id (questionId, 하향식);
  answererId: number; //답변자id
  profileImg: string;
  answerer: string; //답변자 닉네임
  content: string; //답변내용
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  canDelete: boolean;
  answerComments: Comments[];
  liked: boolean | null;
}

interface AnswerViewerProps {
  loggedIn: Boolean;
  answers: Answers[];
  questionerId: number;
}

const AnswerViewer: React.FC<AnswerViewerProps> = ({
  loggedIn,
  answers,
  questionerId,
}) => {
  //추후 수정 필요
  const apiUrl = "https://api.alco4dev.com";

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /////코멘트 (댓글) 관련/////

  //모든 답변의 코멘트들을 합친 배열을 펼쳐서 초기값으로 설정. 각 comment객체에 answerId값을 추가. 어떤 답변에 대한 코멘트인지 알 수 있게
  const initialComments: Comments[] = answers?.flatMap((answer) =>
    answer.answerComments.map((comment) => ({
      ...comment,
      answerId: answer.answerId,
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

  //답변글 삭제 버튼 클릭시
  const answerDelBtnClickHandler = async (answerId: number) => {
    try {
      // 삭제 요청 보내기
      await axios.delete(`${apiUrl}/v1/answer/${answerId}/delete`);

      // 성공 메시지 얼럿을 보여줌
      window.alert("답변이 삭제되었습니다.");
    } catch (error) {
      // 삭제 요청이 실패한 경우 에러 처리
      console.error("답변 삭제 요청 실패:", error);
      // 실패 메시지 얼럿을 보여줌
      window.alert("삭제 요청이 실패했습니다.");
    }
  };

  //코멘트 삭제 버튼 클릭시
  const commentDelBtnClickHandler = async (commentId: number) => {
    try {
      // 삭제 요청 보내기
      await axios.delete(`${apiUrl}/v1/comment/${commentId}/delete`);

      // 성공 메시지 얼럿을 보여줌
      window.alert("댓글이 삭제되었습니다.");
    } catch (error) {
      // 삭제 요청이 실패한 경우 에러 처리
      console.error("댓글 삭제 요청 실패:", error);
      // 실패 메시지 얼럿을 보여줌
      window.alert("삭제 요청이 실패했습니다.");
    }
  };

  /////답변글 좋아요 관련/////
  //유저가 답변글에 좋아요,싫어요 했는지 여부
  const [isAnswerLiked, setIsAnswerLiked] = useState<boolean>(false);
  const [answerLikeCount, setAnswerLikeCount] = useState<number>(0);

  //유저정보 어떻게 보내는지 확인필요 (수정 필요할 수 있음)
  const handleLikeClick = async (answerId: number) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/v1/answer/${answerId}/like`
      );
      const { liked, likeCount } = response.data;
      setIsAnswerLiked(liked);
      setAnswerLikeCount(likeCount);
    } catch (error) {
      console.error("답변 좋아요 PATCH요청 에러:", error);
    }
  };

  return (
    <>
      {answers?.length > 0 &&
        answers.map((answer) => (
          <div className="answer-viewer-layout" key={answer.answerId}>
            <div className="answer-viewer-container">
              <div className="answer-viewer-header">
                <span className="answer-viewer-header-user-photo">
                  <img
                    className="answerer-profile-image"
                    src="/images/profile_default.png"
                    alt=""
                  />
                </span>
                <div className="answer-header-block">
                  <div className="user-info">
                    <div className="answerer-name">{answer.answerer}</div>
                    {questionerId == answer.answererId && (
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

                {answer.canDelete && (
                  <div className="answer-delete-btn-container">
                    <button
                      onClick={() =>
                        answerDelBtnClickHandler(answer.answererId)
                      }
                      className="answer-delete-btn"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              <div className="answer-content">{answer.content}</div>
              <div className="answer-viewer-footer">
                <button
                  onClick={() => handleLikeClick(answer.answerId)}
                  className="like-button"
                >
                  <span>
                    {answer.liked ? <AiFillLike /> : <AiOutlineLike />}
                  </span>
                  <div>좋아요</div>
                  <span className="answer-like-count">{answer.likeCount}</span>
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
            {comments?.length > 0 &&
              comments.map(
                (comment) =>
                  comment.answerId == answer.answerId && (
                    <div
                      className="comment-view-container"
                      key={comment.commentId}
                    >
                      <div className="comment-viewer-header">
                        <span>
                          <img
                            className="commenter-profile-img"
                            src="/images/profile_default.png"
                            alt=""
                          />
                        </span>
                        <div className="user-date-info">
                          <div className="user-badge-container">
                            <div className="commenter-name">
                              {comment.commenter}
                            </div>
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

                        {comment.canDelete && (
                          <div className="comment-delete-btn-container">
                            <button
                              onClick={() =>
                                commentDelBtnClickHandler(comment.commentId)
                              }
                            >
                              삭제
                            </button>
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
