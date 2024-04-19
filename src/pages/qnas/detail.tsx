import "./detail.scss";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import AnswerEditor from "../../components/qnas/AnswerEditor";
import AnswerViewer from "../../components/qnas/AnswerViewer";
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
    questionId: 1,
    questionerId: 1234567,
    questioner: "메추리",
    profileImg: "anonymous.png",
    title: "flutter 공부하고 있는 4학년 재학생입니다",
    content:
      "안녕하세요, 현재 플러터를 공부하고 있는 4학년 소프트웨어학과 학생입니다. 3학년때 처음 플러터를 알게 되었고 공부에 흥미가 생겨서 현재까지도 하고있습니다. 희망진로가 없었던 터라 현재 공부하고 있는 플러터로 취업을 할까 고민중입니다. 플러터를 공부하면서 동시에 3학년 2학기에 팀프로젝트로 안드로이드 스튜디오를 이용한 사이드프로젝트를 만든 경험이 있습니다. 하지만 네이티브 앱을 작업하면서 확실히 플러터의 매력에 더 빠지게 되었습니다. 이런 상황에서 플러터만 공부해서 취업하는 것이 가능할까요? 아니면 네이티브 앱을 주로 공부하면서 플러터 프로젝트를 병행해야 할까요?",
    createdAt: "2024-04-12T18:10:46.656117",
    updatedAt: null,
    likeCount: 3,
    dislikeCount: 0,
    canDelete: false,
    answers: [
      {
        questionId: 6,
        answerId: 1,
        answererId: 1,
        profileImg: "anonymous.png",
        answerer: "나까무라답변자",
        content:
          "플러터만 공부하셔도 취업에는 크게 문제 없을거에요. 네이티브 코드를 아무것도 몰라도 플러터만 잘 알면 앱 개발이 가능하기 때문입니다. 그런데 플러터나 리액트 네이티브와 같은 하이브리드 앱을 개발하는 툴로 개발을 하다보면 패키지 오류라던지 등으로 인해 네이티브 코드를 건드려야 하는 상황이 오실거에요. 그래서 네이티브 코드를 이해하면 하이브리드앱을 개발할때도 도움이 되실거에요. 그리고 플러터 개발자를 구직하는 많은 채용공고들의 우대사항에 네이티브 앱 개발경험과 네이티브 모듈 작성 경험이 포함되어있는 경우가 많습니다. 그래서 저는 네이티브 코드도 어느정도 이해할 수 있도록 학습하시는 편이 좋을 것 같습니다?",
        createdAt: "2024-04-13T18:11:00.046106",
        updatedAt: "2024-04-13T18:11:00.046106",
        likeCount: 7,
        canDelete: true,
        answerComments: [
          {
            commentId: 1,
            content:
              "현재 졸업전에 정처기 취득과 코테공부 중에서 고민중에 있습니다. 둘 증 어느것에 플러터 취업에 더 도움되는지 여쭤봐도 될까요?",
            commenterId: 1234567,
            commenter: "코멘터1",
            profileImage: "anonymous.png",

            createdAt: "2024-04-14T18:11:15.262025",
            canDelete: false,
          },
          {
            commentId: 2,
            content:
              "저는 코테공부라고 생각합니다. 모든 자격증은 없는 것보단 좋은데 엄청나게 강점이 있다고 보기는 어렵다고 생각합니다",
            commenterId: 1,
            commenter: "강병전",
            profileImage: "anonymous.png",
            createdAt: "2024-04-16T18:11:16.048811",
            canDelete: false,
          },
        ],
        liked: true,
      },

      {
        questionId: 8,
        answerId: 2,
        answererId: 12,
        profileImg: "anonymous.png",
        answerer: "aigoia",
        content:
          "최근에 플러터를 쓰는 회사에서 요청이 와서 이직중인데 수요가 있기는 한거 같습니다. 다만 저는 플러터 개발자는 아니고 게임 개발자이고 플러터는 곁가지로 살짝 맛만 본 수준입니다.",
        createdAt: "2024-04-14T18:11:00.822348",
        updatedAt: "2024-04-14T18:11:00.822348",
        likeCount: 2,
        canDelete: false,
        answerComments: [],
        liked: false,
      },
    ],
    liked: true,
    disliked: false,
  };

  //임의로넣은 상태. 추후 데이터 형식에 따라서 수정 필요
  const [question, setQuestion] = useState<Question | null>(mockData);

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
        console.log("Question 데이터 GET 성공", response.data);
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
