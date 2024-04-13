import { IoIosSearch } from "react-icons/io";
import "./search.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import dummyProfiles, { Profile } from "../../dummy/profileDummy";

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get("q") || ""; // 검색어가 없을 경우 빈 문자열을 기본값으로 사용

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      // 검색어가 비어있지 않은 경우에만 검색 페이지로 이동
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // 임의의 검색 결과 수
  const profileResultsCount = 99; // 예시에서는 99로 가정
  const qnaResultsCount = 999;

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
        <div className="search__icon">
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
        <div className="search__profile">
          <div className="search__profile__title">
            <h2>프로필 {profileResultsCount}</h2>
            <div
              className="search__profile__more"
              onClick={() =>
                navigate(
                  `/search?q=${encodeURIComponent(searchQuery)}&tab=profiles`
                )
              }
            >
              모두 보기 &gt;
            </div>
          </div>
          <div className="search__profile__list">
            {/* 더미 프로필 데이터를 반복하여 각각의 프로필 항목을 생성 */}
            {dummyProfiles.map((profile) => (
              <div key={profile.id} className="search__profile__item">
                <div className="search__profile__item__first">
                  <img src="./images/profile_default.png" alt="" />
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
        <div className="search__qna">
          <div className="search__qna__title">
            <h2>게시물 {qnaResultsCount}</h2>
          </div>
          <div className="search__qna__list">
            <div className="search__qna__item">
              <div className="search__qna__item__question">
                <span className="search__qna__item__question__Q">Q.</span>{" "}
                디자이너가 배우기에 리액트랑 플러터 중 어떤 게 더 좋을까요?
              </div>
              <div className="search__qna__item__content">
                구멍가게 수준의 서비스를 만들어보려고 하는데요. 주제는 아직
                명확하게 정해지지는 않았어요. 프로그래밍 경험은 유니티 3D c#으로
                vr, ar 컨텐츠를 10개정도 만들어 본 경험이 있습니다. 주로 전시
                컨텐츠나 기업의 프로모션으로 단발적인 프로젝트들이 위주였다면
                긴호흡으로 사용자들이 오래 쓰는
              </div>
              <div className="search__qna__item__third">
                <div className="search__qna__item__third__answer">답변 4</div>
                <div className="search__qna__item__third__right">
                  <div className="search__qna__item__third__view">조회 634</div>
                  <div className="search__qna__item__third__date">
                    2023-03-22
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
