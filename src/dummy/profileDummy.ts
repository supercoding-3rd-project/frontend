export interface Profile {
  id: number;
  name: string;
  job: string;
  description: string;
  followerCount: number;
}

const dummyProfiles: Profile[] = [
  {
    id: 1,
    name: "김청운",
    job: "프론트엔드 개발자",
    description: "스타트업 프론트엔드 개발자",
    followerCount: 107,
  },
  {
    id: 2,
    name: "주진성",
    job: "백엔드 개발자",
    description: "지상 최강의 남자",
    followerCount: 215,
  },
  {
    id: 3,
    name: "박윤정",
    job: "백엔드 개발자",
    description: "트타스업 백엔드 개발자",
    followerCount: 0,
  },
  {
    id: 4,
    name: "손다니엘",
    job: "프론트엔드 개발자",
    description: "외국에서 30년 살다옴.",
    followerCount: 1000000000000,
  },
  {
    id: 5,
    name: "김학준",
    job: "프론트엔드 개발자",
    description: "술 잘 마심",
    followerCount: 777,
  },
  // 여기에 더 많은 더미 프로필 데이터 추가 가능
];

export default dummyProfiles;
