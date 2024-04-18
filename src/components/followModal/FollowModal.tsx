import React, { useState, useEffect } from "react";
import styles from "./FollowModal.module.scss"; // 모달 스타일을 위한 CSS 모듈
import useUserFollowData from "../../hooks/useUserFollowData";
import Modal from "./modal";

interface FollowModalProps {
  userId: string;
  activeTab: "followers" | "followings";
  onClose: () => void;
}

const FollowModal: React.FC<FollowModalProps> = ({
  userId,
  activeTab: initialTab,
  onClose,
}) => {
  const [currentTab, setCurrentTab] = useState<"followers" | "followings">(
    initialTab
  );
  const { followers, followings, loading } = useUserFollowData(userId);

  // 내부 상태를 prop 변경에 따라 업데이트합니다.
  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  if (loading) return <div>Loading...</div>;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className={styles.tabs}>
        <button
          onClick={() => setCurrentTab("followers")}
          className={currentTab === "followers" ? styles.active : ""}
        >
          팔로워
        </button>
        <button
          onClick={() => setCurrentTab("followings")}
          className={currentTab === "followings" ? styles.active : ""}
        >
          팔로잉
        </button>
      </div>
      <div className={styles.tabContent}>
        {currentTab === "followers" && (
          <ul>
            {followers.map((follower) => (
              <li key={follower.id}>{follower.username}</li>
            ))}
          </ul>
        )}
        {currentTab === "followings" && (
          <ul>
            {followings.map((following) => (
              <li key={following.id}>{following.username}</li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

export default FollowModal;
