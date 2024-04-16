import "./detail.scss";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import AnswerEditor from "src/components/qnas/AnswerEditor";
import AnswerViewer from "src/components/qnas/AnswerViewer";
import { PiUserCircle } from "react-icons/pi";
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

interface Question {
  id: number;
  title: string;
  content: string;
  questionerId: number;
  questioner: string;
  createdAt: string;
  updatedAt: null;
  likeCount: number;
  dislikeCount: number;
  answers: Answers[];
  liked: boolean;
  disliked: boolean;
}

export default function QnaDetailPage() {
  //추후 수정 필요
  const apiUrl = "";
  //로그인상태, 추후 useEffect로 수정해서 처음 랜더링시 로그인 여부 판단하기
  const [loggedIn, setLoggedIn] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState<number>(1234567); //추후 로그인관련 로직 추가 필요

  const mockData: Question = {
    id: 6,
    title: "질문입니다.",
    content: "이유를알고싶다 왜안되니",
    questionerId: 1234567,
    questioner: "메추리",
    createdAt: "2024-04-12T18:10:46.656117",
    updatedAt: null,
    likeCount: 0,
    dislikeCount: 5,
    answers: [
      {
        id: 1,
        content: "뭐가 궁금하신데요?",
        answerId: 1,
        questionId: 6,
        userId: 1,
        username: "나까무라답변자",
        createdAt: "2024-04-13T18:11:00.046106",
        updatedAt: "2024-04-13T18:11:00.046106",
        likeCount: 0,
        answerComments: [],
        liked: false,
      },

      {
        id: 2,
        content: "죄송합니다. 쓰다가 말았네요.",
        answerId: 2,
        questionId: 6,
        userId: 1234567,
        username: "메추리",
        createdAt: "2024-04-13T18:11:00.822348",
        updatedAt: "2024-04-13T18:11:00.822348",
        likeCount: 0,

        answerComments: [],
        liked: false,
      },
      {
        id: 3,
        content: "??",
        answerId: 3,
        questionId: 6,
        userId: 1,
        username: "나까무라복사품",
        createdAt: "2024-04-13T18:11:01.470863",
        updatedAt: "2024-04-13T18:11:01.470863",
        likeCount: 0,

        answerComments: [
          {
            id: 1,
            content: "뭐라는걸까요 궁금",
            commenterId: 1,
            commenter: "코멘터1",
            createdAt: "2024-04-14T18:11:15.262025",
            updatedAt: "2024-04-15T18:11:15.262025",
          },
          {
            id: 2,
            content: "기다리고 있습니다",
            commenterId: 1,
            commenter: "코멘터2",
            createdAt: "2024-04-16T18:11:16.048811",
            updatedAt: "2024-04-17T18:11:16.048811",
          },
          {
            id: 3,
            content: "작성자입니다. 해결되었습니다. 감사합니다.",
            commenterId: 1234567,
            commenter: "메추리",
            createdAt: "2024-04-18T18:11:16.709377",
            updatedAt: "2024-04-19T18:11:16.709377",
          },
          {
            id: 4,
            content: "여태 기다렸는데...",
            commenterId: 1,
            commenter: "코멘터4",
            createdAt: "2024-04-20T18:11:17.23705",
            updatedAt: "2024-04-20T18:11:17.23705",
          },
          {
            id: 5,
            content: "5~~~~~",
            commenterId: 2,
            commenter: "코멘터5",
            createdAt: "2024-04-21T23:02:22.853126",
            updatedAt: "2024-04-21T23:02:22.853126",
          },
        ],
        liked: false,
      },
    ],
    liked: false,
    disliked: false,
  };

  //임의로넣은 상태. 추후 데이터 형식에 따라서 수정 필요
  const [question, setQuestion] = useState<Question>(mockData);

  //날짜, 시간 포멧팅
  const formattedDateYYMMDD = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  //좋아요 관련
  const [liked, setLiked] = useState<Question["liked"]>(
    question ? question.liked : false
  ); //좋아요상태
  const [disliked, setDisliked] = useState<Question["disliked"]>(
    question ? question.liked : false
  ); //싫어요상태
  const [likeCount, setLikeCount] = useState<Question["likeCount"]>(
    question ? question.likeCount : 0
  ); //좋아요 수
  const [dislikeCount, setDislikeCount] = useState<Question["dislikeCount"]>(
    question ? question.dislikeCount : 0
  ); //싫어요 수

  // const postLikeStatus = (id: number, userId: number, liked: boolean) => {
  //   axios
  //     //추후 엔드포인트 수정 필요
  //     .post(`${apiUrl}`, {
  //       id: 11,
  //       liked: false, //추후수정필요 상태값으로해서 클릭할때마다 바뀌게 해야할듯
  //     })
  //     .then((response) => {
  //       console.log("요청이 성공했습니다");
  //     });
  // };

  // //when Like button clikced
  // const handleLike = () => {
  //   if (loggedIn) {
  //     //0이거나-1일때 (좋아요버튼 안눌렀었던 상태)
  //     if (!liked) {
  //       setLiked(true);

  //       //서버교류없이 브라우저에서 바로 증가숫자 보여줌
  //       setLikeCount(likeCount + 1);
  //       //서버에 요청 보내기
  //       postLikeStatus(question.id, question.id, 1);

  //       //-1싫어요 상태였다면
  //       if (disliked) {
  //         setDisliked(false); //싫어요 취소
  //         setDislikeCount(dislikeCount - 1);
  //         //서버에 요청 보내기
  //         postLikeStatus(question.id, question.id, 1);
  //       }
  //     }
  //     //1 좋아요 상태였다면
  //     else {
  //       setLiked(false);
  //       setLikeCount(likeCount - 1);
  //       //서버에 요청 보내기
  //       postLikeStatus(question.id, question.id, 1);
  //     }
  //   }
  // };

  // //when Dislike button clikced
  // const handleDislike = () => {
  //   if (loggedIn) {
  //     if (!disliked) {
  //       setDisliked(true);
  //       setDislikeCount(dislikeCount + 1);
  //       postLikeStatus(question.id, question.id, -1);
  //       if (liked) {
  //         setLiked(false);
  //         setLikeCount(likeCount - 1);
  //         postLikeStatus(question.id, question.id, -1);
  //       }
  //     } else {
  //       setDisliked(false);
  //       setDislikeCount(dislikeCount - 1);
  //       postLikeStatus(question.id, question.id, -1);
  //     }
  //   }
  // };

  /////처음 렌더링시 데이터 가져오기/////

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(apiUrl); // API 요청
        setQuestion(response.data); // 성공적으로 데이터를 가져왔을 때 상태 업데이트
        console.log("Question 데이터 GET 성공");
      } catch (error) {
        setQuestion(mockData); // 실패 시 mock data를 사용하여 상태 업데이트
        console.log("Question 데이터 GET 실패:", error);
      }
    };

    getPost(); // 함수 호출
  }, []);

  /////삭제 버튼 클릭시 /////
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옴
  //질문글 삭제 버튼 클릭시
  const questionDelBtnClickHandler = async () => {
    try {
      // 삭제 요청 보내기
      await axios.delete(`${apiUrl}/v1/question/${question.id}/delete`);
      // 삭제가 성공하면 deleted 상태를 true로 업데이트
      setDeleted(true);
      // 성공 메시지 얼럿을 보여줌
      window.alert("삭제되었습니다.");
      // 메인 페이지로 이동
      navigate("/");
    } catch (error) {
      // 삭제 요청이 실패한 경우 에러 처리
      console.error("삭제 요청 실패:", error);
      // 실패 메시지 얼럿을 보여줌
      window.alert("삭제 요청이 실패했습니다.");
    }
  };
  //답변글 삭제 버튼 클릭시

  //코멘트 삭제 버튼 클릭시

  return (
    <div className="qna-detail-page-layout">
      <div className="viewer-answer-wrapper">
        <div className="quetion-delete-btn-container">
          {loggedIn && loggedInUserId === question.questionerId && (
            <button
              className="quetion-delete-btn"
              onClick={questionDelBtnClickHandler}
            >
              삭제
            </button>
          )}
        </div>

        <div className="viewer-container">
          <h2>{question.title}</h2>
          <div className="post-info">
            <div>{formattedDateYYMMDD(question.createdAt)}</div>
            <div>•</div>
            <div>조회 29</div>
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
                >
                  <div>
                    <span>
                      <IoIosArrowRoundUp />
                    </span>
                    추천해요
                  </div>
                  <span>{question.likeCount}</span>
                </button>

                <button className="dislike-button">
                  <span>
                    <IoIosArrowRoundDown />
                  </span>
                  보충이 필요해요
                  <span>{question.dislikeCount}</span>
                </button>
              </div>
            </div>
            <div className="writer-info">
              <span>
                <PiUserCircle />
              </span>
              {`${question.questioner} `}님의 질문
            </div>
          </div>
        </div>
        <AnswerEditor />
        <div className="answer-count">
          <h2>답변 {question.answers.length}</h2>
        </div>

        <AnswerViewer
          loggedIn={loggedIn}
          loggedInUserId={loggedInUserId}
          answers={question.answers}
          questionerId={question.questionerId}
        />
      </div>
    </div>
  );
}
