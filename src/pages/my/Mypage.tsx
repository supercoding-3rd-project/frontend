import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Mypage.module.scss";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import FollowModal from "../../components/followModal/FollowModal";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  about: string;
  followersCount: number;
  followingCount: number;
  photoURL?: string;
  questionBoardResDtoList?: QuestionBoardResDto[]; // 질문과 답변 목록
}

interface QuestionBoardResDto {
  questionId: string;
  title: string;
  content: string;
  answers: Answer[]; // 답변 목록
}

interface Answer {
  answerId: string;
  content: string;
}

const MyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"answers" | "questions">(
    "answers"
  ); // 초기 탭을 'answers'로 설정

  const [modalActiveTab, setModalActiveTab] = useState<
    "followers" | "followings"
  >("followers");
  const [isModalOpen, setModalOpen] = useState(false);

  const openFollowersModal = () => {
    setModalActiveTab("followers");
    setModalOpen(true);
  };

  const openFollowingsModal = () => {
    setModalActiveTab("followings");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/users/login");
          return;
        }
        const response = await axios.get(
          "http://localhost:8080/api/v1/user/myPage",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data); // 이제 response.data에는 백엔드에서 받은 사용자 정보가 포함되어 있습니다.
      } catch (error) {
        console.error("사용자 정보를 불러오는 데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    navigate("/users/login"); // 로그인 페이지로 리다이렉트
  };
  // 로딩 상태 렌더링
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 사용자 정보가 없을 경우 에러 처리
  if (!user) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  const handleEdit = () => {
    // navigate 함수와 함께 목데이터를 state로 전달하여 편집 페이지로 이동
    navigate("/my/update", { state: { user: user } });
  };

  const changeTab = (tabName: "answers" | "questions") => {
    setActiveTab(tabName);
  };

  return (
    <div className={styles.mypageContainer}>
      <div className={styles.userContent}>
        <div className={styles.profilePicContainer}>
          <img
            src={user?.photoURL || "/images/profile_default.png"}
            alt="Profile"
          />
        </div>
      </div>
      <div className={styles.userInfo}>
        <p className={styles.userName}>
          {user?.name}
          <Link
            to="/my/update"
            className={styles.editbutton}
            onClick={handleEdit}
          >
            <FaEdit className={styles.editIcon} />
          </Link>
          <Link
            to="/users/login"
            className={styles.logoutbutton}
            onClick={handleLogout}
          >
            <FaSignOutAlt className={styles.logoutIcon} />
          </Link>
        </p>
        <div className={styles.followInfo}>
          <div onClick={openFollowersModal}>팔로워 {user.followersCount}</div>
          <div onClick={openFollowingsModal}>팔로잉 {user.followingCount}</div>
        </div>
        <p>{user?.about}</p>
      </div>
      <div className={styles.tabContainer}>
        {/* 탭 버튼 */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "answers" ? styles.active : ""
            }`}
            onClick={() => changeTab("answers")}
          >
            답변
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "questions" ? styles.active : ""
            }`}
            onClick={() => changeTab("questions")}
          >
            질문
          </button>
        </div>
      </div>
      {/* 탭 내용 */}
      <div className={styles.tabContent}>
        {activeTab === "answers" && user && user.questionBoardResDtoList && (
          <div>
            {user.questionBoardResDtoList
              .flatMap((item) => item.answers)
              .map((answer) => (
                <div key={answer.answerId}>
                  <p>{answer.content}</p>
                </div>
              ))}
          </div>
        )}
        {activeTab === "questions" && user && user.questionBoardResDtoList && (
          <div>
            {user.questionBoardResDtoList.map((question) => (
              <div key={question.questionId}>
                <h3>{question.title}</h3>
                <p>{question.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <FollowModal
          userId={user.id}
          activeTab={modalActiveTab}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default MyPage;
