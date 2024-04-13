import { useState, useEffect, useCallback } from "react";

/**
 * 대상 사용자의 팔로우 상태와 팔로우/언팔로우 액션을 관리하는 훅입니다.
 * @param {string} targetUserId 대상 사용자의 ID입니다.
 * @returns 팔로우 상태와 팔로우/언팔로우 액션을 수행하는 함수를 반환합니다.
 */
const useFollowSystem = (targetUserId: unknown) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // 팔로우 상태를 확인하는 함수
  const checkFollowStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/follow/status/${targetUserId}`, {
        method: "GET",
        // 필요한 경우 인증 토큰 등을 헤더에 추가
      });
      if (!response.ok) {
        throw new Error("Failed to check follow status");
      }
      const { following } = await response.json();
      setIsFollowing(following);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  }, [targetUserId]);

  // 팔로우/언팔로우 액션을 수행하는 함수
  const handleFollowAction = useCallback(async () => {
    try {
      const response = await fetch(`/api/follow/${targetUserId}`, {
        method: "POST",
        body: JSON.stringify({ follow: !isFollowing }),
        headers: {
          "Content-Type": "application/json",
          // 필요한 경우 인증 토큰 등을 헤더에 추가
        },
      });
      if (!response.ok) {
        throw new Error("Failed to update follow status");
      }
      setIsFollowing(!isFollowing); // 팔로우 상태를 업데이트
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  }, [targetUserId, isFollowing]);

  // 컴포넌트 마운트 시 팔로우 상태를 확인
  useEffect(() => {
    if (targetUserId) {
      checkFollowStatus();
    }
  }, [targetUserId, checkFollowStatus]);

  return { isFollowing, handleFollowAction };
};

export default useFollowSystem;
