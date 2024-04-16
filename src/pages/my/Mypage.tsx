import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Mypage.module.scss";
import { FaEdit } from "react-icons/fa";

interface User {
  id: string;
  photoURL?: string; // photoURL은 선택적 속성으로, 있을 수도 있고 없을 수도 있습니다.
  // 여기에 더 많은 사용자 관련 속성을 추가할 수 있습니다.
}

const MyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("answers");

  const navigate = useNavigate();

  // 사용자 인증 상태를 확인하는 함수
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/status", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Please log in to access your profile.");
      }
      // 인증된 경우 사용자 정보를 가져옵니다
      const userDataResponse = await fetch("/api/user/info", {
        credentials: "include",
      });
      if (!userDataResponse.ok) {
        throw new Error("Failed to fetch user info");
      }
      const userData = await userDataResponse.json();
      // 가져온 사용자 정보를 상태에 업데이트합니다
      setName(userData.name);
      setUsername(userData.username);
      setEmail(userData.email);
      setAbout(userData.about);
      setFollowersCount(userData.followersCount);
      setFollowingCount(userData.followingCount);
    } catch (error) {
      console.error(error);
      alert("로그인을 해주세요."); // 사용자에게 메시지 표시
      navigate("/users/login"); // 로그인 페이지로 이동
    }
  }, [navigate]);

  // 사용자 정보를 불러오는 함수
  const fetchUserInfo = useCallback(async () => {
    // 저장된 토큰을 가져옵니다
    const token = localStorage.getItem("userToken");

    // 토큰이 있는지 확인합니다
    if (!token) {
      console.error("토큰을 찾을 수 없습니다");
      return;
    }

    try {
      // Authorization 헤더와 함께 엔드포인트에 GET 요청을 보냅니다
      const response = await fetch("http://localhost:8080/api/v1/user/myPage", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰을 사용한다고 가정합니다
        },
      });

      if (!response.ok) {
        throw new Error("사용자 정보를 가져오는데 실패했습니다");
      }

      const data = await response.json();
      // 가져온 데이터로 상태를 업데이트합니다
      setUser({
        id: data.userId.toString(), // 상태가 문자열을 기대한다면 문자열로 변환
        photoURL: data.imageUrl,
        // ... 그 외의 사용자 데이터
      });
    } catch (error) {
      console.error(error);
      // 에러를 처리합니다, 예를 들어 상태에 에러 메시지를 설정합니다
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]); // checkAuthStatus를 의존성 배열에 포함

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]); // fetchUserInfo를 의존성 배열에 포함

  const handleEdit = () => {
    navigate("/myupdate");
  };

  return (
    <div className={styles.mypageContainer}>
      <h1>Welcome to My Page</h1>
      <div className={styles.userContent}>
        <div className={styles.profilePicContainer}>
          <img
            src={user?.photoURL || "/images/profile_default.png"}
            alt="Profile"
          />
        </div>
      </div>
      <div className={styles.userInfo}>
        <p>
          이름:{name}
          <Link
            to="/my/update"
            className={styles.editbutton}
            onClick={handleEdit}
          >
            <FaEdit />
          </Link>
        </p>
        <p>유저이름:{username}</p>
        <div className={styles.followInfo}>
          <p>팔로워: {followersCount}</p>
          <p>팔로잉: {followingCount}</p>
        </div>
        <p>이메일:{email}</p>
        <p>자기소개:{about}</p>
      </div>
      {/* 탭 버튼 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "answers" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("answers")}
        >
          답변
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "questions" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("questions")}
        >
          질문
        </button>
      </div>
      {/* 탭 내용 */}
      {activeTab === "answers" && (
        <div className={styles.tabContent}>
          {/* 답변 컨텐츠를 여기에 렌더링 */}
          내가 한 답변들...
        </div>
      )}

      {activeTab === "questions" && (
        <div className={styles.tabContent}>
          {/* 질문 컨텐츠를 여기에 렌더링 */}
          내가 한 질문들...
        </div>
      )}
    </div>
  );
};

export default MyPage;
