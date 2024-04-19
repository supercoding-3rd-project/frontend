import "./index.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { PiUserCircle } from "react-icons/pi";
import { BiSolidPencil } from "react-icons/bi";
import { BiCommentDots } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { AxiosResponse } from "axios";

//apiUrl,endpoint추가필요. 그때 mockData두가지(initial,load more post) 삭제하기. 페이지3,4,5,6...도 잘 불러와지는지 확인하기
interface Posts {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  mainAllQuestionDto: Question[];
}

interface Question {
  questionId: number;
  title: string;
  content: string;
  questionerId: number;
  questioner: string;
  profileImg: string;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  answers: Answer[];
}

interface Answer {
  id: number;
  content: string;
  answererId: number;
  answerer: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string | null;
}

//interface User {
//  id: string;
//  photoURL?: string; // photoURL은 선택적 속성으로, 있을 수도 있고 없을 수도 있습니다.
// 여기에 더 많은 사용자 관련 속성을 추가할 수 있습니다.
//}

//fetch실패시 받아오는 mockData.추후 api주소 넣고 삭제예정
const mockData: Posts = {
  currentPage: 1,
  totalPages: 2,
  pageSize: 5,
  totalItems: 6,
  mainAllQuestionDto: [
    {
      questionId: 6,
      title: "6번글입니다",
      content: "무라!",
      questionerId: 1,
      questioner: "나까무라",
      profileImg: "anonymous.png",
      createdAt: "2024-04-17T20:09:07.052803",
      likeCount: 0,
      dislikeCount: 0,
      answers: [],
    },
    {
      questionId: 5,
      title: "5번글입니다",
      content: "무라!",
      questionerId: 1,
      questioner: "나까무라",
      profileImg: "anonymous.png",
      createdAt: "2024-04-17T20:09:02.481032",
      likeCount: 0,
      dislikeCount: 0,
      answers: [],
    },
    {
      questionId: 4,
      title: "4번글입니다",
      content: "무라!",
      questionerId: 1,
      questioner: "나까무라",
      profileImg: "anonymous.png",
      createdAt: "2024-04-17T20:08:58.381366",
      likeCount: 0,
      dislikeCount: 0,
      answers: [],
    },
    {
      questionId: 3,
      title: "3번글입니다",
      content: "무라!",
      questionerId: 1,
      questioner: "나까무라",
      profileImg: "anonymous.png",
      createdAt: "2024-04-17T20:08:54.72818",
      likeCount: 0,
      dislikeCount: 0,
      answers: [],
    },
    {
      questionId: 2,
      title: "2번글입니다",
      content: "무라!",
      questionerId: 1,
      questioner: "나까무라",
      profileImg: "anonymous.png",
      createdAt: "2024-04-17T20:08:50.755407",
      likeCount: 0,
      dislikeCount: 0,
      answers: [
        {
          id: 3,
          content: "무엇이 문제인 거죠",
          answererId: 1,
          answerer: "나까무라",
          likeCount: 0,
          createdAt: "2024-04-17T20:10:27.734717",
          updatedAt: "2024-04-17T20:10:27.734717",
        },
      ],
    },
  ],
};
export default function QnaListPage() {
  const apiUrl: string = "https://api.alco4dev.com";

  const [mainData, setMainData] = useState<Posts | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  //페이지 중복 로딩 방지를 위한 플래그 값
  const [loadingPage, setLoadingPage] = useState<number | null>(null);

  //글쓰기 버튼 클릭시 사용
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); //추후 로그인관련 로직 추가 필요

  //글쓰기 버튼 클릭 핸들러 //로그인을 전역상태로 관리하는게 맞는듯. 지금은 토큰여부만 확인하는 로직으로 넣음

  const writeBtnClickHandler = () => {
    const token = localStorage.getItem("token");

    token ? setIsLoggedIn(true) : setIsLoggedIn(false);
    if (isLoggedIn) {
      navigate(`/qnas/create`);
    }
    if (!isLoggedIn) {
      alert("로그인을 해주세요."); // 사용자에게 메시지 표시
      navigate("users/login"); // 로그인 페이지로 이동
    }
  };

  //날짜, 시간 포멧팅
  const formattedDateYYMMDD = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  //포스트 클릭했을때 해당 글 상세 페이지로 이동하는 핸들러
  const handlePostClick = (postId: number) => {
    navigate(`/qnas/${postId}`);
  };

  // 질문 데이터 가져오기
  const fetchQuestions = useCallback(
    async (page: number) => {
      try {
        /// 중복요청 방지를 위한 플래그값.이미 다른 페이지를 로딩 중인 경우 무시
        if (loadingPage === null) {
          /// 현재 페이지를 로딩 중으로 설정
          setLoadingPage(page);
          setIsLoading(true);
          const response: AxiosResponse<Posts> = await axios.get<Posts>(
            `${apiUrl}/api/search?page=${page}`
          );
          const data = response.data;
          const eachPageData = data.mainAllQuestionDto;
          // setMainData((prevData) =>
          //   prevData ? { ...prevData, ...eachPageData } : eachPageData
          // );

          setMainData((prevData) =>
            prevData
              ? {
                  ...prevData,
                  mainAllQuestionDto: [
                    ...prevData.mainAllQuestionDto,
                    ...eachPageData,
                  ],
                }
              : {
                  currentPage: 1,
                  totalPages: 5,
                  pageSize: 5,
                  totalItems: 5,
                  mainAllQuestionDto: eachPageData,
                }
          );

          setCurrentPage(data.currentPage); // 숫자로 된 페이지 번호를 상태로 설정
          setTotalPages(data.totalPages);
          setIsLoading(false);
          console.log(
            "데이터 GET요청 성공, 전체 데이터:",
            mainData,
            "요청페이지:",
            page,
            data.currentPage
          );
        }
      } catch (error) {
        console.error("데이터 GET요청 실패:", error);
      } finally {
        // 로딩이 완료되면 로딩 중인 페이지를 초기화
        setLoadingPage(null);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMainData, setCurrentPage, setTotalPages, loadingPage]
  );

  // Intersection Observer 콜백 함수
  const handleObserver: IntersectionObserverCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoading && totalPages > currentPage) {
          observer.current?.unobserve(entry.target);
          fetchQuestions(currentPage + 1);
        }
      });
    },
    [currentPage, fetchQuestions, isLoading, totalPages]
  );

  // Intersection Observer 설정
  const observer = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    const sentinel = document.getElementById("sentinel");
    if (sentinel && mainData) {
      observer.current = new IntersectionObserver(handleObserver, {
        threshold: 0.5,
      });
      observer.current.observe(sentinel);
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [mainData]);

  // const observer = useRef<IntersectionObserver | null>(null);

  // // Intersection Observer 콜백 함수, 요소가 교차(intersect)할 때 실행할 로직
  // const handleObserver = (entries: IntersectionObserverEntry[]) => {
  //   entries.forEach((entry) => {
  //     console.log(entry.isIntersecting);
  //     //화면 안에 요소가 들어왔는지 체크
  //     if (entry.isIntersecting && !isLoading && totalPages > currentPage) {
  //       //기존 관찰하던 요소는 더 이상 관찰하지 않음
  //       observer.current?.unobserve(entry.target);
  //       //페이지 fetch요청
  //       fetchQuestions(currentPage + 1)
  //         .then(() => {})
  //         .catch((error) => {
  //           console.error("Error fetching data:", error);
  //         });
  //     }
  //   });
  // };

  // useEffect(() => {
  //   //관찰할 대상을 선언하고,해당 속성을 관찰
  //   const sentinel = document.getElementById("sentinel");
  //   if (sentinel && mainData) {
  //     //1페이지가 로드 되어 mainData가 null이 아닐때만
  //     // Intersection Observer 설정
  //     observer.current = new IntersectionObserver(handleObserver, {
  //       threshold: 0.5,
  //     });
  //     observer.current.observe(sentinel); // sentinel 요소를 관찰 대상으로 추가
  //   }

  //   return () => {
  //     if (observer.current) {
  //       observer.current.disconnect();
  //     }
  //   };
  // }, [setTotalPages, setCurrentPage]); // 의존성 추가

  //처음 페이지 진입시 1pg 데이터 받아오기
  useEffect(() => {
    if (currentPage === 1) {
      fetchQuestions(currentPage);
    }
  }, []);

  return (
    <div className="qnalist-layout">
      <div className="layout">
        <button className="write-button" onClick={writeBtnClickHandler}>
          <div className="write-button-left-box">
            <span className="user-img-wrapper">
              <img
                className="user-img"
                src={"/images/profile_default.png"}
                alt=""
              />
            </span>
            <div className="write-button-text-container">
              <div className="write-button-text">
                나누고 싶은 생각이 있으신가요?
              </div>
            </div>
          </div>

          <span>
            <BiSolidPencil />
          </span>
        </button>
        {/*mapping mock data*/}

        <div>
          {mainData &&
            mainData.mainAllQuestionDto &&
            mainData.mainAllQuestionDto.map((post: Question) => (
              <button
                onClick={() => handlePostClick(post.questionId)}
                className="post-container"
                key={post.questionId}
              >
                <div className="post-container-header">
                  <div className="respondent-description">
                    <span>
                      <BiCommentDots />
                    </span>
                    {post.answers && post.answers.length > 0 ? (
                      <div className="questioner-answerer-desc">
                        <div className="questioner-answerer-text">
                          {post.answers[0].answerer} 님이 질문에 답변을 남겼어요
                        </div>
                      </div>
                    ) : (
                      <div className="questioner-answerer-desc">
                        <div className="questioner-answerer-text">
                          {post.questioner} 님이 질문을 남겼어요
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="respondent-info">
                    <span>
                      <img
                        className="questioner-answerer-img"
                        src="/images/profile_default.png"
                        alt=""
                      />
                    </span>
                    <span>
                      {post.answers && post.answers.length > 0 ? (
                        <div className="answerer-userName">
                          {post.answers[0].answerer}
                        </div>
                      ) : (
                        <div className="answerer-userName">
                          {post.questioner}
                        </div>
                      )}
                      {post.questioner ? (
                        <div className="post-date">
                          {formattedDateYYMMDD(post.createdAt)}
                        </div>
                      ) : (
                        <div className="post-date">
                          {formattedDateYYMMDD(post.createdAt)}
                        </div>
                      )}
                    </span>
                  </div>
                </div>

                <div className="question-box-wrapper">
                  <div className="question-box">
                    <div className="q-symbol">
                      <div>Q.</div>
                    </div>
                    <div className="post-title">{post.title}</div>
                    <div className="post-question">{post.content}</div>
                  </div>

                  {post.answers && post.answers.length > 0 ? (
                    <div className="post-answer">{post.answers[0].content}</div>
                  ) : (
                    <div className="pls-leave-answer">
                      첫 답변을 작성해주세요
                    </div>
                  )}
                </div>
                <div>
                  <div className="like-count">좋아요{post.likeCount}</div>
                  <div className="like-comment">
                    <span className="icons">
                      <AiOutlineLike />
                    </span>
                    <span>좋아요</span>
                    <span className="icons">
                      <BiCommentDots />
                    </span>
                    <span>
                      댓글{" "}
                      {post.answers && post.answers ? post.answers.length : "0"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
        </div>

        <div className="loading-wrapper">
          {isLoading && <div className="loading"></div>}
        </div>

        <div id="sentinel"></div>
        {/* show Loading icon when loading*/}
      </div>
    </div>
  );
}
