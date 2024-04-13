import React, { useEffect, useState } from "react";
import "./notifications.scss";
import { notiDummy } from "../../dummy/notiDummy";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  profileImage?: string; // 사용자가 지정한 프로필 이미지가 없을 수 있으므로 옵셔널 처리
  name: string;
  type: string;
  title: string;
  content: string;
  date: string;
  seen: boolean;
  postId?: string; // postId가 없을 수도 있으므로 옵셔널 처리
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(notiDummy);
  const navigate = useNavigate();

  useEffect(() => {
    // 웹소켓 연결
    const socket = new WebSocket("ws://example.com"); // 백엔드에서 제공하는 웹소켓 엔드포인트 사용
    // 웹소켓 연결 이벤트 핸들러 등록
    socket.onopen = () => {
      // 웹소켓 연결이 열렸을 때, JWT 토큰을 요청하여 받아옴
      fetch("http://example.com/authenticate", {
        method: "POST",
        credentials: "include", // JWT 토큰을 쿠키에 저장하거나 헤더에 포함하기 위해 쿠키를 전송
      })
        .then((response) => response.json())
        .then((data) => {
          // JWT 토큰을 받아와서 저장 또는 처리
          const token = data.token;
          // 여기서 받아온 토큰을 사용하여 웹소켓 연결 인증
          socket.send(JSON.stringify({ type: "authenticate", token: token }));
        })
        .catch((error) => {
          console.error("Error authenticating:", error);
        });
    };

    // 새로운 알림이 도착할 때마다 알림 목록을 업데이트
    socket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
    };

    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => {
      socket.close();
    };
  }, []);

  const markNotificationAsSeen = (notificationId: string) => {
    // 서버에 알림 확인 상태 전달하는 요청 보내기
    fetch(`http://example.com/notifications/${notificationId}/mark-as-seen`, {
      method: "POST",
      credentials: "include", // 인증이 필요한 경우 쿠키를 전송하여 서버에 인증 정보 제공
    })
      .then((response) => {
        if (response.ok) {
          console.log("Notification marked as seen successfully");
        } else {
          console.error("Failed to mark notification as seen");
        }
      })
      .catch((error) => {
        console.error("Error marking notification as seen:", error);
      });
    // 알림 확인 상태를 클라이언트에서 변경.
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, seen: true }
          : notification
      )
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    // 알림 확인 상태를 서버에 전달
    markNotificationAsSeen(notification.id!);
  };

  const handleButtonClick = (notification: Notification) => {
    markNotificationAsSeen(notification.id!);

    switch (notification.type) {
      case "welcome":
      case "follow":
        // 해당 유저와의 채팅창으로 이동
        navigate(`/chat/${notification.id}`);
        break;
      case "answer":
      case "comment":
      case "likeQuestion":
      case "likeAnswer":
        // 해당 게시글로 이동
        navigate(`/post/${notification.postId}`);
        break;
      default:
        break;
    }
  };

  const getNotificationTitle = (notification: Notification) => {
    switch (notification.type) {
      case "welcome":
        return " 알코에 오신걸 환영합니다!";
      case "follow":
        return ` 님이 나를 팔로우했어요!`;
      case "answer":
        return ` 님이 내 질문에 답변을 남겼어요!`;
      case "comment":
        return ` 님이 내 답변에 댓글을 남겼어요!`;
      case "likeQuestion":
        return ` 님이 내 질문에 좋아요를 했어요!`;
      case "likeAnswer":
        return ` 님이 내 답변에 좋아요를 했어요!`;
      default:
        return "";
    }
  };

  const getButtonText = (type: string) => {
    switch (type) {
      case "answer":
      case "comment":
      case "likeQuestion":
      case "likeAnswer":
        return "해당 글로 이동";
      case "welcome":
      case "follow":
        return "메시지";
      default:
        return "";
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);

    // 날짜가 valid 이면 수정
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return `${date.getFullYear() % 100}.${
        date.getMonth() + 1
      }.${date.getDate()}`;
    } else if (days > 0) {
      return `${days}일 전`;
    } else if (hours > 0) {
      return `${hours}시간 전`;
    } else {
      return `${minutes}분 전`;
    }
  };

  const MAX_CONTENT_LENGTH = 30; // 최대 표시할 부가 텍스트 길이

  const getTruncatedContent = (content: string): string => {
    if (content.length <= MAX_CONTENT_LENGTH) {
      return content; // 텍스트 길이가 최대 길이 이하이면 그대로 반환
    } else {
      return `${content.substring(0, MAX_CONTENT_LENGTH)}...`; // 최대 길이 이상이면 일부를 자르고 '...'으로 대체하여 반환
    }
  };

  return (
    <div className="noti">
      <div className="noti__body">
        <div className="noti__title">
          <h1>알림</h1>
        </div>
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`noti__item ${item.seen ? "" : "unseen"}`}
            onClick={() => handleNotificationClick(item)}
          >
            <div className="noti__item-profile">
              {item.seen ? null : <div className="red-dot"></div>}
              <img
                src={
                  item.profileImage
                    ? item.profileImage
                    : "/images/profile_default.png"
                }
                alt=""
              />
            </div>
            <div className="noti__item__block">
              <div className="noti__item-title">
                <div className="noti__item-title-name">{item.name}</div>
                <div className="noti__item-title-sub">
                  {getNotificationTitle(item)}
                </div>
              </div>
              <div className="noti__item-content">
                {item.type === "answer" || item.type === "comment"
                  ? getTruncatedContent(item.content)
                  : null}
              </div>
              <div className="noti__item-date">
                {getFormattedDate(item.date)}
              </div>
            </div>
            {item.type === "message" ? null : (
              <div className="noti__item-btn">
                <button onClick={() => handleButtonClick(item)}>
                  {getButtonText(item.type)}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
