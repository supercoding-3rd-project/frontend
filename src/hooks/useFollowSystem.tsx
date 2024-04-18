import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// 사용자 ID와 현재 팔로우 상태를 받는 훅
const useFollowSystem = (userId: string, initialIsFollowing: boolean) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  // 팔로우 상태를 서버에 요청하여 확인하는 함수
  const fetchFollowStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/user/follow/${userId}`,
        {
          headers: {
            /* ... 인증 헤더 ... */
          },
        }
      );
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Failed to fetch follow status", error);
    }
  }, [userId]);

  // 사용자를 팔로우/언팔로우하는 함수
  const toggleFollow = useCallback(async () => {
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const response = await axios({
        method,
        url: `http://localhost:8080/api/v1/user/follow/${userId}`,
        headers: {
          /* ... 인증 헤더 ... */
        },
      });
      // 성공적으로 팔로우/언팔로우 처리가 되면 상태 업데이트
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Failed to toggle follow status", error);
    }
  }, [userId, isFollowing]);

  // 컴포넌트 마운트 시 팔로우 상태 확인
  useEffect(() => {
    fetchFollowStatus();
  }, [fetchFollowStatus]);

  return { isFollowing, toggleFollow };
};

export default useFollowSystem;
