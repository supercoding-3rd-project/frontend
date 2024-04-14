import "./index.scss";
import { useEffect, useState } from "react";
import SidePanel from "src/components/qnas/SidePanel";
import { PiUserCircle } from "react-icons/pi";
import { BiSolidPencil } from "react-icons/bi";
import { BiCommentDots } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";

interface Post {
  [pageNumber: number]: Question[];
}
interface Question {
  id: number;
  title: string;
  content: string;
  questionerId: number;
  questioner: string;
  createdAt: string;
  updatedAt: string | null;
  likeCount: number;
  answers?: Answer[];
}

interface Answer {
  id?: number;
  content?: string;
  answererId?: number;
  answerer?: string;
  createdAt?: string;
  updatedAt?: string | null;
  likeCount?: number;
  comments?: Comment[];
}

interface Comment {
  id: number;
  content: string;
  commenterId: number;
  commenter: string;
  createdAt: string;
  updatedAt: string | null;
}

//
const initialPosts: Post = {
  "1": [
    {
      id: 7,
      title: "질문글 제목인데요",
      content: "거기 누구 없나요?",
      questionerId: 1,
      questioner: "병아리",
      createdAt: "2024-04-13T00:44:04.624507",
      updatedAt: null,
      likeCount: 1,
      answers: [],
    },
    {
      id: 6,
      title: "챗지피티를 이용한 학습",
      content:
        "안녕하세요 자바 개발자 목표로 준비중인 취준생입니다.제가 공부하는 방식이 옳은지 잘 몰라서 질문드려봅니다.일단 1. 이런 단계로 작업하면 되겠다 생각 2. 제가 직접 작업 3. 그래도 안풀리면 챗지피티한테 질문 또는 예시",
      questionerId: 1,
      questioner: "삐약이",
      createdAt: "2024-04-13T00:44:03.943922",
      updatedAt: null,
      likeCount: 7,
      answers: [
        {
          id: 1,
          content:
            "남이 써둔 코드를 보고 배우는것도 큰 공부 입니다. 챗 지피티는 내가 생각했던걸 알기쉽게 코딩해주니 더할나위없이 좋죠. GPT이전에는 내가 생각한걸 그대로 코딩해둔 예시를 찾는 것 자체가 어려웠습니다.화이팅하세요",
          answererId: 1,
          answerer: "부엉이",
          likeCount: 5,
          createdAt: "2024-04-13T00:44:11.551289",
          updatedAt: "2024-04-13T00:44:11.551289",
          comments: [
            {
              id: 1,
              content: "댓글이라네",
              commenterId: 1,
              commenter: "민달팽이",
              createdAt: "2024-04-13T00:44:20.089146",
              updatedAt: "2024-04-13T00:44:20.089146",
            },
            {
              id: 2,
              content: "댓글댓글",
              commenterId: 1,
              commenter: "쥐며느리",
              createdAt: "2024-04-13T00:44:20.756373",
              updatedAt: "2024-04-13T00:44:20.756373",
            },
            {
              id: 3,
              content: "윙윙윙",
              commenterId: 1,
              commenter: "꿀벌",
              createdAt: "2024-04-13T00:44:21.467602",
              updatedAt: "2024-04-13T00:44:21.467602",
            },
          ],
        },
      ],
    },
  ],
};
export default function QnaListPage() {
  const [mockPosts, setMockPosts] = useState<Post>(initialPosts); //data status
  const [loading, setLoading] = useState<boolean>(false); //data loading status. to show users 'Loading...' during Loaded.

  //서버에서 받아온 데이터를 재가공 하는 로직
  const processedData = Object.values(initialPosts).flatMap((questions) => {
    return questions.map((question: Question) => {
      const mostLikedAnswer: any = question.answers?.reduce(
        (prevAnswer: Answer | undefined, currentAnswer: Answer) => {
          // 좋아요 수가 가장 많은 answer추출
          if (
            !prevAnswer ||
            (currentAnswer.likeCount ?? 0) > (prevAnswer.likeCount ?? 0)
          ) {
            return currentAnswer;
          }

          return prevAnswer;
        },
        // 초기 값
        undefined
      );

      // 만약 answers가 빈 배열이라면 mostLikedAnswer에는 null이 할당됨
      if (
        !mostLikedAnswer &&
        question.answers &&
        question.answers.length === 0
      ) {
        // 빈 배열일 경우에 대한 처리를 수행
      }

      return {
        questionId: question.id,
        questionTitle: question.title,
        questionContent: question.content,
        questioner: question.questioner,
        questionCreaetedAt: question.createdAt,
        questionUpdatedAt: question.updatedAt,
        questionLikeCount: question.likeCount,
        mostLikedAnswerId: mostLikedAnswer ? mostLikedAnswer.id : null,
        mostLikedAnswerContent: mostLikedAnswer
          ? mostLikedAnswer.content
          : null,
        answerer: mostLikedAnswer ? mostLikedAnswer.answerer : null,
        mostLikedAnswerLikeCount: mostLikedAnswer
          ? mostLikedAnswer.likeCount
          : null,
        mostLikedAnswerCreatedAt: mostLikedAnswer
          ? mostLikedAnswer.createdAt
          : null,
        mostLikedAnswerUpdatedAt: mostLikedAnswer
          ? mostLikedAnswer.updatedAt
          : null,
      };
    });
  });

  //additional data load function
  const loadMorePosts = () => {
    //API request simulation (add addtional data after 1 sec) 추후 수정 예정
    setTimeout(() => {
      //create new data. 현재 API 가 없어서 테스트 위한 mock data임
      const newPosts: Post = {
        "1": [
          {
            id: 8,
            title: "글인데요",
            content: "잘 부탁드려요",
            questionerId: 1,
            questioner: "나까무라",
            createdAt: "2024-04-13T00:44:04.624507",
            updatedAt: null,
            likeCount: 0,
            answers: [],
          },
        ],
      };
      //기존 mock data에 새로운 데이터 추가
      setLoading(false);
      setMockPosts((prevPosts) => ({ ...prevPosts, ...newPosts }));
    }, 1000); //가상의 API 응답 시간 (1초)
  };

  //scroll event handler
  //const handleScroll = () => {
  // y-coordinate of the content bottom user can see
  //  const scrollPosition = window.innerHeight + window.scrollY;
  // total height of the document in pixel
  //  const pageHeight = document.documentElement.offsetHeight;
  //  const distanceFromBottom = pageHeight - scrollPosition;

  // When the user is within 10px from the bottom, load additional data
  //   if (!loading && distanceFromBottom < 10) {
  //    console.log("scroll event handler working");
  //    loadMorePosts();
  //  }
  //};

  //add scroll event listner when component mounted
  //useEffect(() => {
  //  window.addEventListener("scroll", handleScroll);
  //  return () => window.removeEventListener("scroll", handleScroll); //remove event listener when //component unmounted
  //}, []);

  useEffect(() => {
    const target = document.querySelector(".target");

    const observer = new IntersectionObserver((mockPosts) => {
      mockPosts.forEach((post) => {
        console.log(post.isIntersecting);
        if (post.isIntersecting && !loading) {
          loadMorePosts();
          setLoading(true);
        }
      });
    });
    if (target) {
      observer.observe(target);
    }
  }, []);
  const target = document.querySelector(".target");

  const observer = new IntersectionObserver((mockPosts) => {
    mockPosts.forEach((post) => {
      console.log(post.isIntersecting);
    });
  });
  if (target) {
    observer.observe(target);
  }

  return (
    <div className="qnalist-layout">
      <div className="layout-left">
        <button className="write-button">
          <div>
            <span>
              <PiUserCircle />
            </span>
            <div>나누고 싶은 생각이 있으신가요?</div>
          </div>

          <span>
            <BiSolidPencil />
          </span>
        </button>
        {/*mapping mock data*/}

        <div>
          {processedData.map((post: any) => (
            <div className="post-container" key={post.questionId}>
              <div className="post-container-header">
                <div className="respondent-description">
                  <span>
                    <BiCommentDots />
                  </span>
                  {post.answerer ? (
                    <div>{post.answerer} 님이 질문에 답변을 남겼어요</div>
                  ) : (
                    <div>{post.questioner} 님이 질문을 남겼어요</div>
                  )}
                </div>
                <div className="respondent-info">
                  <span className="profile-img">
                    <PiUserCircle />
                  </span>
                  <span>
                    {post.answerer ? (
                      <div>{post.answerer}</div>
                    ) : (
                      <div>{post.questioner}</div>
                    )}

                    <div className="post-date">{post.questionCreatedAt}</div>
                  </span>
                </div>
              </div>

              <div>
                <div className="question-box">
                  <div className="q-symbol">Q.</div>
                  <div className="post-title">{post.questionTitle}</div>
                  <div className="post-question">{post.questionContent}</div>
                </div>

                {post.mostLikedAnswerContent ? (
                  <div className="post-answer">
                    {post.mostLikedAnswerContent}
                  </div>
                ) : (
                  <div>첫 답변을 작성해주세요</div>
                )}
              </div>
              <div>
                <div className="like-count">좋아요{post.questionLikeCount}</div>
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
                    {post.answers && post.answers.comments
                      ? post.answers.comments.length
                      : "0"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="target">target</div>
        {/* show Loading icon when loading*/}
        {loading && <div className="loading"></div>}
      </div>
      <SidePanel />
    </div>
  );
}
