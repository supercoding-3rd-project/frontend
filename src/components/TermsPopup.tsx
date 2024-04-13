import Accordion from "./AccordionSection";
import "./footer.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { sections } from "./TermsSections";

interface Props {
  onClose: () => void;
}

export default function TermsPopup({ onClose }: Props) {
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
        <h2 className="popup__title">이용약관</h2>
        <Accordion sections={sections} />
      </div>
    </div>
  );
}
