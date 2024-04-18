import React, { useEffect, useState } from "react";
import styles from "./UserPage.module.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import useFollowSystem from "../../hooks/useFollowSystem";
import FollowModal from "../../components/followModal/FollowModal";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  about: string;
  followersCount: number;
  followingCount: number;
  photoURL: string;
  isFollowing: boolean; // 이제 이 속성이 필수입니다.
}

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalActiveTab, setModalActiveTab] = useState<
    "followers" | "followings"
  >("followers");
  const { username } = useParams();

  useEffect(() => {
    // 서버로부터 사용자 정보를 가져오는 함수
    const fetchUserData = async () => {
      try {
        // 이 예시에서는 hard-coded된 URL을 사용하지만, 실제 사용자 ID를 동적으로 적용해야 합니다.
        const response = await axios.get(
          `http://localhost:8080/api/user/${username}`
        );
        // 서버 응답에서 사용자 데이터를 가져와 상태를 업데이트합니다.
        setUser({
          ...response.data,
          isFollowing: false, // 이 값은 서버 응답에 따라 동적으로 결정되어야 합니다.
        });
      } catch (error) {
        console.error("사용자 정보를 불러오는 데 실패했습니다.", error);
      }
    };

    fetchUserData();
  }, [username]);

  // useFollowSystem 훅 사용
  const { isFollowing, toggleFollow } = useFollowSystem(
    user?.id || "",
    user?.isFollowing || false
  );

  const openModal = (tab: "followers" | "followings") => {
    setModalActiveTab(tab);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // UI 렌더링 부분
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.userPageContainer}>
      <div className={styles.profilePicContainer}>
        <img
          src={user.photoURL}
          alt={`${user.username}'s profile`}
          className={styles.profilePic}
        />
      </div>
      <h2 className={styles.username}>{user.name}</h2>
      <div className={styles.followInfo}>
        <span onClick={() => openModal("followers")}>
          팔로워 {user.followersCount}
        </span>
        {" • "}
        <span onClick={() => openModal("followings")}>
          팔로잉 {user.followingCount}
        </span>
      </div>
      <p className={styles.about}>{user.about}</p>
      <button onClick={toggleFollow} className={styles.followButton}>
        {isFollowing ? "언팔로우" : "팔로우"}
      </button>
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

export default UserPage;
