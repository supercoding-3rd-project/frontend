import "./detail.scss";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import AnswerEditor from "components/qnas/AnswerEditor";
import AnswerViewer from "components/qnas/AnswerViewer";
import { PiUserCircle } from "react-icons/pi";
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

interface Question {
  questionId: number;
  questionerId: number;
  questioner: string;
  profileImg: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: null;
  likeCount: number;
  dislikeCount: number;
  canDelete: false;
  answers: Answers[];
  liked: boolean;
  disliked: boolean;
}

export default function QnaDetailPage() {
  //추후 수정 필요
  const apiUrl = "https://api.alco4dev.com";

  const [loggedIn, setLoggedIn] = useState(true);
  //const [loggedInUserId, setLoggedInUserId] = useState<number>(1234567); //추후 로그인관련 로직 추가 필요

  //이전 페이지에서 postId클릭해서 넘어왔을때 url의 고유식별자(postId)를 추출. 이를 이용해 useEffect로 데이터 요청
  const { postId } = useParams();

  const mockData: Question = {
    questionId: 6,
    questionerId: 1234567,
    questioner: "메추리",
    profileImg: "anonymous.png",
    title: "질문입니다.",
    content:
      "현재 중소기업에서 데이터분석가로 일하고 있습니다. 하지만 데이터분석일은 하지않고 거의 파이썬 개발일, 프로젝트관리 정도만 하고 있습니다. 국가과제를 주로 하는 회사의 특성상 제안서가 떨어지면 그마저도 일이 없습니다. 복지도 줄어드는 것이 보입니다. 지금 2년차고, 회사에 데이터 직무 선배는 커녕 개발자도 없습니다. 이직이 정말 간절한데, 회사에서 배운게 없어 포폴 할만한 것도 없고, 코테도 점점 자신이 없어 집니다. 배우고 성장하는게 중요한 사람인데, 먼거리 출퇴근할 때마다, 너무 괴롭고 눈물이 납니다.",
    createdAt: "2024-04-12T18:10:46.656117",
    updatedAt: null,
    likeCount: 0,
    dislikeCount: 5,
    canDelete: false,
    answers: [
      {
        questionId: 6,
        answerId: 1,
        answererId: 1,
        profileImg: "anonymous.png",
        answerer: "나까무라답변자",
        content: "뭐가 궁금하신데요?",
        createdAt: "2024-04-13T18:11:00.046106",
        updatedAt: "2024-04-13T18:11:00.046106",
        likeCount: 1,
        canDelete: false,
        answerComments: [],
        liked: true,
      },

      {
        questionId: 6,
        answerId: 2,
        answererId: 1234567,
        profileImg: "anonymous.png",
        answerer: "메추리",
        content: "죄송합니다. 쓰다가 말았네요.",
        createdAt: "2024-04-13T18:11:00.822348",
        updatedAt: "2024-04-13T18:11:00.822348",
        likeCount: 0,
        canDelete: false,
        answerComments: [],
        liked: false,
      },
      {
        questionId: 6,
        answerId: 3,
        answererId: 1,
        profileImg: "anonymous.png",
        answerer: "나까무라복사품",
        content: "??",
        createdAt: "2024-04-13T18:11:01.470863",
        updatedAt: "2024-04-13T18:11:01.470863",
        likeCount: 0,
        canDelete: false,
        answerComments: [
          {
            commentId: 1,
            content: "뭐라는걸까요 궁금",
            commenterId: 1,
            commenter: "코멘터1",
            profileImage: "anonymous.png",

            createdAt: "2024-04-14T18:11:15.262025",
            canDelete: false,
          },
          {
            commentId: 2,
            content: "기다리고 있습니다",
            commenterId: 1,
            commenter: "코멘터2",
            profileImage: "anonymous.png",

            createdAt: "2024-04-16T18:11:16.048811",
            canDelete: false,
          },
          {
            commentId: 3,
            content: "작성자입니다. 해결되었습니다. 감사합니다.",
            commenterId: 1234567,
            commenter: "메추리",
            profileImage: "anonymous.png",

            createdAt: "2024-04-18T18:11:16.709377",
            canDelete: false,
          },
          {
            commentId: 4,
            content: "여태 기다렸는데...",
            commenterId: 1,
            commenter: "코멘터4",
            profileImage: "anonymous.png",

            createdAt: "2024-04-20T18:11:17.23705",
            canDelete: false,
          },
          {
            commentId: 5,
            content: "5~~~~~",
            commenterId: 2,
            commenter: "코멘터5",
            profileImage: "anonymous.png",
            createdAt: "2024-04-21T23:02:22.853126",
            canDelete: false,
          },
        ],
        liked: false,
      },
    ],
    liked: false,
    disliked: false,
  };

  //임의로넣은 상태. 추후 데이터 형식에 따라서 수정 필요
  const [question, setQuestion] = useState<Question | null>(null);

  //날짜, 시간 포멧팅
  const formattedDateYYMMDD = (dateString: string | undefined) => {
    if (!dateString) return ""; // dateString이 없으면 빈 문자열 반환
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  /////질문글 좋아요 관련/////
  //유저가 질문글에 좋아요,싫어요 했는지 여부
  const [isQuestionLiked, setIsQuestionLiked] = useState<Question["liked"]>(
    question && loggedIn ? question.liked : false
  );
  const [isQuestionDisliked, setIsQuestionDisliked] = useState<
    Question["disliked"]
  >(question && loggedIn ? question.liked : false); //싫어요상태
  const [questionlikeCount, setQuestionLikeCount] = useState<
    Question["likeCount"]
  >(question ? question.likeCount : 0); //좋아요 수
  const [questionDislikeCount, setQuestionDislikeCount] = useState<
    Question["dislikeCount"]
  >(question ? question.dislikeCount : 0); //싫어요 수
  const questionId = question?.questionId;

  //유저정보 어떻게 보내는지 확인필요 (수정 필요할 수 있음)
  const handleLikeClick = async () => {
    try {
      // 사용자 토큰을 가져오는 작업 (예시: localStorage에 저장된 토큰을 사용)
      const userToken = localStorage.getItem("userToken");

      // 헤더에 사용자 토큰을 포함시켜 PATCH 요청을 보냄
      const response = await axios.patch(
        `${apiUrl}/api/v1/question/${questionId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // 헤더에 토큰을 포함시킴
          },
        }
      );

      // 응답 데이터 처리
      const { liked, disliked, likeCount, dislikeCount } = response.data;
      setIsQuestionLiked(liked);
      setIsQuestionDisliked(disliked);
      setQuestionLikeCount(likeCount);
      setQuestionDislikeCount(dislikeCount);
    } catch (error) {
      console.error("좋아요 PATCH요청 에러:", error);
    }
  };

  const handleDislikeClick = async () => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/v1/question/${questionId}/dislike`
      );
      const { liked, disliked, likeCount, dislikeCount } = response.data;
      setIsQuestionLiked(liked);
      setIsQuestionDisliked(disliked);
      setQuestionLikeCount(likeCount);
      setQuestionDislikeCount(dislikeCount);
    } catch (error) {
      console.error("싫어요 PATCH요청 에러:", error);
    }
  };

  /////삭제 버튼 클릭시 /////

  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옴
  //질문글 삭제 버튼 클릭시
  const questionDelBtnClickHandler = async () => {
    try {
      // 삭제 요청 보내기
      await axios.delete(
        `${apiUrl}/api/v1/question/${question?.questionId}/delete`
      );

      // 성공 메시지 얼럿을 보여줌
      window.alert("질문이 삭제되었습니다.");
      // 메인 페이지로 이동
      navigate("/");
    } catch (error) {
      // 삭제 요청이 실패한 경우 에러 처리
      console.error("삭제 요청 실패:", error);
      // 실패 메시지 얼럿을 보여줌
      window.alert("삭제 요청이 실패했습니다.");
    }
  };

  //코멘트 삭제 버튼 클릭시

  /////처음 렌더링시 데이터 가져오기/////

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/question/${postId}`); // API 요청, postId는 usePrams사용해서 요청
        setQuestion(response.data); // 성공적으로 데이터를 가져왔을 때 상태 업데이트
        console.log("Question 데이터 GET 성공");
      } catch (error) {
        console.log("Question 데이터 GET 실패:", error);
      }
    };

    getPost(); // 함수 호출
  }, []);

  return (
    <div className="qna-detail-page-layout">
      <div className="viewer-answer-wrapper">
        <div className="quetion-delete-btn-container">
          {question?.canDelete && (
            <button
              className="quetion-delete-btn"
              onClick={questionDelBtnClickHandler}
            >
              삭제
            </button>
          )}
        </div>

        <div className="viewer-container">
          <div className="title">{question?.title}</div>
          <div className="post-info">
            <div>{formattedDateYYMMDD(question?.createdAt) ?? ""}</div>
            <div className="dot-btw-title-postinfo">•</div>
            <div>조회 29</div>
          </div>

          <div className="viewer-component-wrapper">
            <Viewer initialValue={question?.content} />
          </div>

          <div className="viewer-footer">
            <div className="like-dislike-wrapper">
              <div className="is-this-useful">이 질문이 도움이 되었나요?</div>
              <div className="like-dislike">
                <button
                  onClick={handleLikeClick}
                  className={`like-button ${
                    isQuestionLiked ? "like-button-clicked" : ""
                  }`}
                >
                  <div className="arrow-btn-wrapper">
                    <span className="arrow-btn">
                      <IoIosArrowRoundUp />
                    </span>
                  </div>
                  추천해요
                  <span>{question?.likeCount}</span>
                </button>

                <button onClick={handleDislikeClick} className="dislike-button">
                  <div className="arrow-btn-wrapper">
                    <span className="arrow-btn">
                      <IoIosArrowRoundDown />
                    </span>
                  </div>
                  보충이 필요해요
                  <span>{question?.dislikeCount}</span>
                </button>
              </div>
            </div>
            <div className="writer-info">
              <img
                className="questioner-profile-img"
                src="/images/profile_default.png"
                alt=""
              />
              {`${question?.questioner} `}님의 질문
            </div>
          </div>
        </div>
        <AnswerEditor />
        {question?.answers && question.answers.length > 0 ? (
          <div className="answer-count">
            <div>답변 {question.answers.length}</div>
          </div>
        ) : null}

        <AnswerViewer
          loggedIn={loggedIn}
          answers={question ? question.answers : []}
          questionerId={question ? question.questionerId : 0}
        />
      </div>
    </div>
  );
}
