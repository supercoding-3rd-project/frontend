import "./header.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [messageArrived, setMessageArrived] = useState(false);
  const [notificationArrived, setNotificationArrived] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      // 검색어가 비어있지 않은 경우에만 검색 페이지로 이동
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch); // 검색창 표시 여부를 토글합니다.
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleRedDotClick = () => {
    if (messageArrived) {
      setMessageArrived(false);
    }
  };

  const handleNotificationClick = () => {
    if (notificationArrived) {
      setNotificationArrived(false);
    }
  };

  // 마이페이지로 이동
  const goToMyPage = () => {
    navigate("/my");
  };

  // 로그아웃
  const handleLogout = () => {
    // 로그아웃 처리하는 코드 작성
  };

  // 드롭다운 토글
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="Header">
      <div className="Header__left">
        <div className="Header__logo" onClick={() => navigate("/")}>
          <img
            className="Header__logo-img"
            src="/images/alco_logo.png"
            alt="로고입니다."
            width={110}
            height={60}
          />
        </div>
        <ul className="Header__menu__left__list">
          <li
            className="Header__menu__left__list-item"
            onClick={() => navigate("/qnas")}
          >
            물어볼랭?
          </li>
          <li
            className="Header__menu__left__list-item"
            onClick={() => navigate("/intro")}
          >
            알코(Al;Co) 뭐니?
          </li>
        </ul>
      </div>
      <div className="Header__menu__right">
        <ul className="Header__menu__right__list">
          <li className="Header__menu__right__list-item search">
            {showSearch && (
              <div
                className={`search-input-container ${showSearch ? "open" : ""}`}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="키워드를 검색해봐!"
                  autoFocus // 입력창에 자동 포커스
                />
                {/* <button onClick={handleSearch}>검색</button> */}
              </div>
            )}
            <div className="search-icon" onClick={toggleSearch}>
              <img src="./asset/search.svg" alt="" />
            </div>
          </li>
          {isLoggedIn ? (
            <>
              <li className="Header__menu__right__list-item message">
                <img
                  src="./asset/chat.svg"
                  alt=""
                  onClick={() => navigate("/messenger")}
                />
                {messageArrived && (
                  <span className="red-dot" onClick={handleRedDotClick}>
                    N
                  </span>
                )}
              </li>
              <li className="Header__menu__right__list-item notification">
                <img
                  src="./asset/noti.svg"
                  alt=""
                  onClick={() => navigate("/notification")}
                />
                {notificationArrived && (
                  <span
                    className="red-dot"
                    onClick={handleNotificationClick}
                  ></span>
                )}
              </li>
              <li
                className="Header__menu__right__list-item mypage"
                onClick={toggleDropdown}
              >
                <img src="./asset/mypage.svg" alt="" />
                {showDropdown && (
                  <div className="dropdown-menu">
                    <ul>
                      <li onClick={goToMyPage}>마이페이지</li>
                      <li onClick={handleLogout}>로그아웃</li>
                    </ul>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li className="Header__menu__right__list-item login">
              <button onClick={() => navigate("/users/login")}>로그인</button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
