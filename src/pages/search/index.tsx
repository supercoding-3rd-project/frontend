import React, { useEffect, useState, KeyboardEvent } from "react";
import { IoIosSearch } from "react-icons/io";
import "./search.scss";
import { useLocation, useNavigate } from "react-router-dom";

interface Profile {
  id: number;
  name: string;
  job: string;
  description: string;
  profileImage: string;
  followerCount: number;
}

interface Qna {
  questionId: number;
  title: string;
  content: string;
  answerCount: number;
  viewCount: number;
  date: string;
}

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [profileResults, setProfileResults] = useState<Profile[]>([]);
  const [qnaResults, setQnaResults] = useState<Qna[] | null>(null);
  const [profileResultsCount, setProfileResultsCount] = useState<number>(0);
  const [qnaResultsCount, setQnaResultsCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileResults = () => {
      fetch(
        `https://api.alco4dev.com/api/search/keyword/user?q=${searchQuery}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "any-value",
          },
        }
      )
        .then((response) => response.json())
        .then((data: Profile[]) => {
          setProfileResults(data);
          setProfileResultsCount(data.length);
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        });
    };

    const fetchQnaResults = () => {
      fetch(
        `https://api.alco4dev.com/api/search/keyword/question?q=${searchQuery}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "any-value",
          },
        }
      )
        .then((response) => response.json())
        .then((data: Qna[]) => {
          setQnaResults(data);
          setQnaResultsCount(data.length);
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
          setQnaResults([]); // 에러 발생 시 빈 배열로 초기화
        });
    };

    if (searchQuery.trim() !== "") {
      fetchQnaResults();
    } else {
      // 검색어가 없을 때에는 빈 배열로 초기화
      setQnaResults([]);
      setQnaResultsCount(0);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search">
      <div className="search__input">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="search__icon" onClick={handleSearch}>
          <IoIosSearch size={35} />
        </div>
      </div>
      <div className="search__body">
        <ul className="search__tabs">
          <li
            className="search__tabs__item"
            onClick={() =>
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
            }
          >
            전체
          </li>
          <li
            className="search__tabs__item"
            onClick={() =>
              navigate(
                `/search?q=${encodeURIComponent(searchQuery)}&tab=profiles`
              )
            }
          >
            프로필 {profileResultsCount}
          </li>
          <li
            className="search__tabs__item"
            onClick={() =>
              navigate(`/search?q=${encodeURIComponent(searchQuery)}&tab=qnas`)
            }
          >
            게시물 {qnaResultsCount}
          </li>
        </ul>
        {/* 프로필 결과 표시 */}
        <div className="search__profile">
          <div className="search__profile__title">
            <h2>프로필 {profileResults.length}</h2>
          </div>
          <div className="search__profile__list">
            {profileResults.map((profile) => (
              <div key={profile.id} className="search__profile__item">
                <div className="search__profile__item__first">
                  <img src={profile.profileImage} alt="" />
                </div>
                <ul className="search__profile__item__second">
                  <li className="search__profile__item__second__name">
                    {profile.name}
                  </li>
                  <li className="search__profile__item__second__job">
                    {profile.job}
                  </li>
                  <li className="search__profile__item__second__sub">
                    {profile.description}
                  </li>
                  <li className="search__profile__item__second__follower">
                    팔로워 {profile.followerCount}
                  </li>
                </ul>
                <div className="search__profile__item__third">
                  <button>팔로우</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 게시물 결과 표시 */}
        <div className="search__qna">
          {qnaResults && (
            <div className="search__qna__title">
              <h2>게시물 {qnaResults.length}</h2>
            </div>
          )}
          {qnaResults && qnaResults.length > 0 && (
            <div className="search__qna__list">
              {qnaResults.map((qna) => (
                <div key={qna.questionId} className="search__qna__item">
                  <div className="search__qna__item__question">
                    <span className="search__qna__item__question__Q">Q.</span>{" "}
                    {qna.title}
                  </div>
                  <div className="search__qna__item__content">
                    {qna.content}
                  </div>
                  <div className="search__qna__item__third">
                    <div className="search__qna__item__third__answer">
                      답변 {qna.answerCount}
                    </div>
                    <div className="search__qna__item__third__right">
                      <div className="search__qna__item__third__view">
                        조회 {qna.viewCount}
                      </div>
                      <div className="search__qna__item__third__date">
                        {qna.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
