import { useState, useEffect } from "react";
import axios from "axios";

interface Follower {
  id: string;
  username: string;
  photoURL: string;
}

interface Following {
  id: string;
  username: string;
  photoURL: string;
}

// 사용자 정의 훅
const useUserFollowData = (userId: string) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followings, setFollowings] = useState<Following[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFollowData = async () => {
      setLoading(true);
      try {
        // 팔로워 리스트 가져오기
        const followersResponse = await axios.get(
          `http://localhost:8080/api/user/follower/${userId}`
        );
        setFollowers(followersResponse.data || []);

        // 팔로잉 리스트 가져오기
        const followingsResponse = await axios.get(
          `http://localhost:8080/api/user/following/${userId}`
        );
        setFollowings(followingsResponse.data || []);
      } catch (error) {
        console.error("팔로우 데이터를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowData();
  }, [userId]);

  return {
    followers,
    followings,
    loading,
  };
};

export default useUserFollowData;
