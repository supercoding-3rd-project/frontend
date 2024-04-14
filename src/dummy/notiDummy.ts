interface Notification {
  id: string;
  profileImage: string;
  name: string;
  type: string;
  title: string;
  content: string;
  date: string;
  seen: boolean;
}

export const notiDummy: Notification[] = [
  {
    id: "1",
    profileImage: "/images/profile_default.png",
    name: "민예빈",
    type: "answer",
    title: "answer",
    content: "그런 식으로 코딩하면 망해요. 그렇다고 알려주기는 싫네요.",
    date: "2024-04-04T12:00:00",
    seen: false,
  },
  {
    id: "2",
    profileImage: "/images/profile_default.png",
    name: "김청운",
    type: "follow",
    title: "follow",
    content: "",
    date: "2024-04-03T12:00:00",
    seen: false,
  },
  {
    id: "3",
    profileImage: "/images/profile_default.png",
    name: "김학준",
    type: "comment",
    title: "comment",
    content: "꺼억~ 역시 포인트는 최고!",
    date: "2024-04-02T12:00:00",
    seen: false,
  },
  {
    id: "4",
    profileImage: "/images/profile_default.png",
    name: "윤동근",
    type: "likeQuestion",
    title: "likeQuestion",
    content: "",
    date: "2024-04-01T12:00:00",
    seen: false,
  },
  {
    id: "5",
    profileImage: "",
    name: "박윤정",
    type: "likeAnswer",
    title: "likeAnswer",
    content: "",
    date: "2024-03-25T12:00:00",
    seen: false,
  },
  // 다른 더미 데이터들 추가
];
