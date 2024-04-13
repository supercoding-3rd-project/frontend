import { useState } from "react";
import "./footer.scss";
import TermsPopup from "./TermsPopup";
import PrivacyPopup from "./PrivacyPopup";

export default function Footer() {
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);

  // 이용약관 클릭 시 팝업 창 표시
  const handleTermsClick = () => {
    setShowTermsPopup(true);
  };

  // 개인정보처리방침 클릭 시 팝업 창 표시
  const handlePrivacyClick = () => {
    setShowPrivacyPopup(true);
  };

  return (
    <div className="footer">
      <div className="footer__first">
        <p className="footer__first__content">
          <span onClick={handleTermsClick}>이용약관</span>
          <span className="separator">|</span>
          <span onClick={handlePrivacyClick}>개인정보처리방침</span>
        </p>
      </div>
      <div className="footer__second">
        <p className="footer__second__content">
          <span>(주) 알코(Al;Co)</span>
          <span className="separator" />
          <span>대표: 주진성</span>
          <div className="tmi">
            TMI, 관례상 회사자본금은 대표가 횡령하고 있음.
          </div>
          <div className="address">
            주소: 서울특별시 강남구 영동대로 512 헤라팰리스 100층 펜트하우스
            다락방
          </div>
        </p>
      </div>
      <div className="footer__third">
        <p className="footer__third__content">
          알코(Al;Co) 서비스에서 제공하는 상품 정보에 대하여 (주)알코는
          통신판매중개자이며, 통신판매의 당사자가 아닙니다.
          <div className="footer__third__content-right">
            <span>만든 녀석들 :</span>
            <div>윤승현, 민예빈, 김청운, 김학준</div>
            <div>박윤정, 최영규, 성희철, 윤동근</div>
          </div>
        </p>
      </div>
      {showTermsPopup && (
        <TermsPopup onClose={() => setShowTermsPopup(false)} />
      )}
      {showPrivacyPopup && (
        <PrivacyPopup onClose={() => setShowPrivacyPopup(false)} />
      )}
    </div>
  );
}
