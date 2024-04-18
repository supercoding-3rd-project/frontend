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
const useUserFollowData = (username: string) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followings, setFollowings] = useState<Following[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFollowData = async () => {
      setLoading(true);
      try {
        // 팔로워 리스트 가져오기
        const followersResponse = await axios.get(
          `https://api.alco4dev.com/api/user/follower/${username}`
        );
        setFollowers(followersResponse.data || []);

        // 팔로잉 리스트 가져오기
        const followingsResponse = await axios.get(
          `https://api.alco4dev.com/api/user/following/${username}`
        );
        setFollowings(followingsResponse.data || []);
      } catch (error) {
        console.error("팔로우 데이터를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowData();
  }, [username]);

  return {
    followers,
    followings,
    loading,
  };
};

export default useUserFollowData;
