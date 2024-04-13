import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UserPage.module.scss";
import useFollowSystem from "../../hooks/useFollowSystem";

const UserPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { isFollowing, handleFollowAction } = useFollowSystem(userId);

  // 서버 API로부터 타 유저의 정보를 가져오는 함수
  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setUserProfile(userData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  // 메시지 버튼 클릭 핸들러
  const handleMessageClick = () => {
    navigate(`/messages/${userId}`);
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.userPageContainer}>
      <h1>{userProfile.nickname || "알 수 없는 사용자"}</h1>
      <img
        src={userProfile.photoURL || "/images/default_profile_pic.png"}
        alt={`${userProfile.nickname}'s profile`}
        className={styles.profilePic}
      />
      <p>{userProfile.name}</p>
      <p>{userProfile.email}</p>
      <p>{userProfile.about}</p>
      <div>팔로워 수: {userProfile.followersCount}</div>
      <div>팔로잉 수: {userProfile.followingCount}</div>
      <button onClick={() => handleFollowAction()}>
        {isFollowing ? "언팔로우" : "팔로우"}
      </button>
      <button onClick={handleMessageClick}>메시지</button>
    </div>
  );
};

export default UserPage;
