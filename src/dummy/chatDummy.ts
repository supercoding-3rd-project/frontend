interface Chat {
  id: number;
  user: string;
  content: string;
  time: string;
}

interface Room {
  roomId: number;
  chats: Chat[];
}

const chatData: Room[] = [
  {
    roomId: 1,
    chats: [
      {
        id: 1,
        user: "mi",
        content: "안녕하세요",
        time: "2024-04-15T12:00:00Z",
      },
      {
        id: 2,
        user: "yu",
        content: "안녕하세요!",
        time: "2024-04-15T12:01:00Z",
      },
      { id: 3, user: "mi", content: "반가워요", time: "2024-04-15T12:02:00Z" },
    ],
  },
  {
    roomId: 2,
    chats: [
      {
        id: 1,
        user: "john",
        content: "Hi there!",
        time: "2024-04-15T12:05:00Z",
      },
      {
        id: 2,
        user: "sara",
        content: "Hey, how are you?",
        time: "2024-04-15T12:06:00Z",
      },
      {
        id: 3,
        user: "john",
        content: "I'm good, thanks!",
        time: "2024-04-15T12:07:00Z",
      },
    ],
  },
  {
    roomId: 3,
    chats: [
      {
        id: 1,
        user: "alex",
        content: "What's up?",
        time: "2024-04-15T12:10:00Z",
      },
      {
        id: 2,
        user: "emma",
        content: "Not much, just chilling.",
        time: "2024-04-15T12:11:00Z",
      },
      {
        id: 3,
        user: "alex",
        content: "Cool, cool.",
        time: "2024-04-15T12:12:00Z",
      },
    ],
  },
];

export default chatData;
