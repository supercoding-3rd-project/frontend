import "./header.scss";
import { IoIosSearch } from "react-icons/io";
import { SlSpeech } from "react-icons/sl";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
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
        <div className="Header__menu__left">
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
      </div>
      <div className="Header__menu__right">
        <ul className="Header__menu__right__list">
          <li className="Header__menu__right__list-item">
            <div className="search-icon" onClick={toggleSearch}>
              <IoIosSearch size={25} />
            </div>
            {showSearch && (
              <div className="search-input-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="검색어를 입력하세요"
                  autoFocus // 입력창에 자동 포커스
                />
                <button onClick={handleSearch}>검색</button>
              </div>
            )}
          </li>
          <li className="Header__menu__right__list-item">
            <SlSpeech size={25} onClick={() => navigate("/messenger")} />
          </li>
          <li className="Header__menu__right__list-item">
            <IoNotificationsOutline
              size={25}
              onClick={() => navigate("/notifications")}
            />
          </li>
          <li className="Header__menu__right__list-item">
            <FaRegCircleUser size={25} onClick={() => navigate("/my")} />
          </li>
        </ul>
      </div>
    </div>
  );
}
