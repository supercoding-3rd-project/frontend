import "./detail.scss";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import AnswerEditor from "src/components/qnas/AnswerEditor";
import AnswerViewer from "src/components/qnas/AnswerViewer";
import { PiUserCircle } from "react-icons/pi";
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";

import { useState } from "react";
import axios from "axios";

export default function QnaDetailPage() {
  //추후 수정 필요
  const apiUrl = "";
  //로그인상태, 추후 useEffect로 수정해서 처음 랜더링시 로그인 여부 판단하기
  const [loggedIn, setLoggedIn] = useState(true);

  //임의로넣은 상태. 추후 데이터 형식에 따라서 수정 필요
  const [question, setQuestion] = useState({
    id: 1, //질문번호
    title: "첫번째 질문글입니다.",
    content: "잘부탁 드려요~",
    questioner: 1, //질문자 id값
    createdAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
    updatedAt: null,
    likeCount: 10,
    dislikeCount: 2,
    userLikeStatus: 0, //속성명 추후 수정하기
    views: "195", //일단 가 데이터. 추후 정하기로 함
    answers: [
      {
        id: 1, //답변번호
        title: "1번 답변의 제목인데요 안쓰이는 속성입니다.",
        content: "1번 답변인데요",
        answerer: 2, //답변자 id값
        likeCount: 1,
        userLikeStatus: 0, //필요여부 및 속성값 정해야함
        createdAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
        updatedAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
        comments: [
          {
            id: 1, //코멘트번호
            content: "1번 댓글인데요",
            commenter: 3, //댓글자 유저 아이디 번호
            createdAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
            updatedAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
          },
          {
            id: 2, //코멘트번호
            content: "2번 댓글인데요",
            commenter: 4, //댓글자 유저 아이디 번호
            createdAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
            updatedAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
          },
        ],
      },
      {
        id: 2, //답변번호
        title: "2번 답변의 제목인데요 안쓰이는 속성입니다.",
        content: "2번 답변인데요",
        answerer: 5, //답변자 id값
        likeCount: 1,
        userLikeStatus: 0, //필요여부 및 속성값 정해야함
        createdAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
        updatedAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
        comments: [
          {
            id: 1, //코멘트번호
            content: "1번 댓글인데요",
            commenter: 6, //댓글자 유저 아이디 번호
            createdAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
            updatedAt: "Fri Apr 12 2024 00:23:45 GMT+0900 (한국 표준시)",
          },
        ],
      },
    ],
  });
  //받아온 데이터들
  const [userId, setUserId] = useState(question.questioner);

  //날짜, 시간 포멧팅
  const formattedDateYYMMDD = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  //좋아요 관련
  const [liked, setLiked] = useState(
    question.userLikeStatus == 1 ? true : false
  ); //좋아요상태
  const [disliked, setDisliked] = useState(
    question.userLikeStatus == -1 ? true : false
  ); //싫어요상태
  const [likeCount, setLikeCount] = useState(question.likeCount); //좋아요 수
  const [dislikeCount, setDislikeCount] = useState(question.dislikeCount); //싫어요 수

  const postLikeStatus = (
    questionId: number,
    userId: number,
    addOrDeduct: number
  ) => {
    axios
      //추후 엔드포인트 수정 필요
      .post(`${apiUrl}`, {
        id: userId,
        userLikeStatus: question.userLikeStatus + addOrDeduct,
      })
      .then((response) => {
        console.log("요청이 성공했습니다");
      });
  };

  //when Like button clikced
  const handleLike = () => {
    if (loggedIn) {
      //0이거나-1일때 (좋아요버튼 안눌렀었던 상태)
      if (!liked) {
        setLiked(true);

        //서버교류없이 브라우저에서 바로 증가숫자 보여줌
        setLikeCount(likeCount + 1);
        //서버에 요청 보내기
        postLikeStatus(question.id, question.id, 1);

        //-1싫어요 상태였다면
        if (disliked) {
          setDisliked(false); //싫어요 취소
          setDislikeCount(dislikeCount - 1);
          //서버에 요청 보내기
          postLikeStatus(question.id, question.id, 1);
        }
      }
      //1 좋아요 상태였다면
      else {
        setLiked(false);
        setLikeCount(likeCount - 1);
        //서버에 요청 보내기
        postLikeStatus(question.id, question.id, 1);
      }
    }
  };

  //when Dislike button clikced
  const handleDislike = () => {
    if (loggedIn) {
      if (!disliked) {
        setDisliked(true);
        setDislikeCount(dislikeCount + 1);
        postLikeStatus(question.id, question.id, -1);
        if (liked) {
          setLiked(false);
          setLikeCount(likeCount - 1);
          postLikeStatus(question.id, question.id, -1);
        }
      } else {
        setDisliked(false);
        setDislikeCount(dislikeCount - 1);
        postLikeStatus(question.id, question.id, -1);
      }
    }
  };

  return (
    <div className="qna-detail-page-layout">
      <div className="viewer-answer-wrapper">
        <div className="quetion-delete-btn-container">
          {loggedIn && <button>삭제</button>}
        </div>

        <div className="viewer-container">
          <h2>{question.title}</h2>
          <div className="post-info">
            <div>{formattedDateYYMMDD(question.createdAt)}</div>
            <div>•</div>
            <div>조회 {question.views}</div>
          </div>

          <div className="viewer-component-wrapper">
            <Viewer initialValue={question.content} />
          </div>

          <div className="viewer-footer">
            <div className="like-dislike-wrapper">
              <div>이 질문이 도움이 되었나요?</div>
              <div className="like-dislike">
                <button
                  className={`like-button ${
                    liked ? "like-button-clicked" : ""
                  }`}
                  onClick={handleLike}
                >
                  <div>
                    <span>
                      <IoIosArrowRoundUp />
                    </span>
                    추천해요
                  </div>
                  <span>{likeCount}</span>
                </button>

                <button className="dislike-button" onClick={handleDislike}>
                  <span>
                    <IoIosArrowRoundDown />
                  </span>
                  보충이 필요해요
                  <span>{dislikeCount}</span>
                </button>
              </div>
            </div>
            <div className="writer-info">
              <span>
                <PiUserCircle />
              </span>
              로빈 님의 질문
            </div>
          </div>
        </div>
        <AnswerEditor />
        <div className="answer-count">
          <h2>답변 {question.answers.length}</h2>
        </div>

        <AnswerViewer
          loggedIn={loggedIn}
          userId={userId}
          answers={question.answers}
        />
      </div>
    </div>
  );
}
