import "./footer.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface Props {
  onClose: () => void;
}

export default function PrivacyPopup({ onClose }: Props) {
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    // 팝업 외부를 클릭하면 onClose 함수를 호출하여 팝업을 닫습니다.
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-container" onClick={handleClickOutside}>
      <div className="popup">
        <div className="popup__btn">
          <button onClick={onClose} className="popup__btn-close">
            <IoIosCloseCircleOutline size={30} />
          </button>
        </div>
        <h2 className="popup__title">개인정보처리방침</h2>
        <div className="privacy">
          <div className="privacy__title">
            <img
              src="/images/alco_logo.png"
              alt=""
              className="privacy__title-img"
              width={120}
              height={80}
            />
            <h3 className="privacy__title-text">알코 개인정보처리방침</h3>
          </div>
          <div className="privacy__main">
            ㈜알코(이하 "회사"라 또는 "알코"이라 함)은 정보통신망이용촉진 및
            정보보호 등에 관한법률(이하 “정보통신망법”)등 정보통신서비스제공자가
            준수하여야 할 관련 법령상의 개인정보보호 규정을 준수하며, 관련
            법령에 의거한 개인정보취급방침을 정하여 이용자권익 보호에 최선을
            다하고 있습니다. 알코의 개인정보취급방침은 다음과 같은 내용을 담고
            있습니다.
          </div>
          <div className="privacy__sub">
            제 1 장 수집하는 개인정보 항목 및 수집방법
            <br /> 제 2 장 개인정보의 수집 및 이용 목적
            <br /> 제 3 장 수집한 개인정보의 보유 및 이용기간
            <br /> 제 4 장 개인정보의 파기절차 및 방법
            <br /> 제 5 장 개인정보의 제공 및 공유
            <br /> 제 6 장 개인정보 위탁처리 업체
            <br /> 제 7 장 개인정보 자동 수집 장치의 설치, 운영 및 거부에 관한
            사항
            <br /> 제 8 장 개인정보보호를 위한 기술적/관리적 대책
            <br /> 제 9 장 이용자 및 법정대리인의 권리와 그 행사방법
            <br /> 제 10 장 개인정보관리책임자 및 상담, 신고
            <br /> 제 11 장 고지
          </div>
        </div>
      </div>
    </div>
  );
}
