import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Mypage.module.scss";

interface User {
  id: string;
  photoURL?: string; // photoURL은 선택적 속성으로, 있을 수도 있고 없을 수도 있습니다.
  // 여기에 더 많은 사용자 관련 속성을 추가할 수 있습니다.
}

const MyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

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
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error(error);
      alert("로그인을 해주세요."); // 사용자에게 메시지 표시
      navigate("/login"); // 로그인 페이지로 이동
    }
  }, [navigate]);

  // 사용자 정보를 불러오는 함수
  const fetchUserInfo = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch user info");
      const data = await response.json();
      setName(data.name);
      setNickname(data.nickname);
      setEmail(data.email);
      setAbout(data.about);
      setFollowersCount(data.followersCount);
      setFollowingCount(data.followingCount);
    } catch (error) {
      console.error(error);
    }
  }, [user]); // user를 의존성 배열에 포함

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]); // checkAuthStatus를 의존성 배열에 포함

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]); // fetchUserInfo를 의존성 배열에 포함

  const handleEdit = () => {
    navigate("/myupdate");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className={styles.mypageContainer}>
      <h1>Welcome to My Page</h1>
      <div className={styles.profilePicContainer}>
        <img
          src={user?.photoURL || "/images/default_profile_pic.png"}
          alt="Profile"
        />
      </div>
      <p>{name}</p>
      <p>{nickname}</p>
      <p>{email}</p>
      <p>{about}</p>
      <p>팔로워 수: {followersCount}</p>
      <p>팔로잉 수: {followingCount}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default MyPage;
