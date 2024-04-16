import React, { useEffect } from "react";
import "./tempSaveModal.scss";
import { IoClose } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";
import axios from "axios";

//부모의 인터페이스 참조
interface SaveSubmitPosts {
  tempId: number;
  title: string;
  content: string;
  createdAt?: "2024-04-16...";
}

interface TempSaveModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tempSavedPosts: SaveSubmitPosts[];
  deleteBtnHandler: () => void;
}

const TempSaveModal = ({
  isModalOpen,
  setIsModalOpen,
  tempSavedPosts,
  deleteBtnHandler,
}: TempSaveModalProps) => {
  useEffect(() => {
    document.body.style.cssText = `
    position:fixed;
    top: -${window.scrollY}px;
    overflow-y:scroll;
    width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, []);

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  //prevent modal close when modal clicked
  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  return (
    <button className="modal-overlay" onClick={closeModalHandler}>
      <div className="modal" onClick={handleModalClick}>
        <div className="modal-title">
          <div>임시 보관함</div>
          <button className="modal-close-btn" onClick={closeModalHandler}>
            <IoClose />
          </button>
        </div>

        {tempSavedPosts.map((post) => (
          <div key={post.tempId} className="temp-saved-post-container">
            <div className="temp-saved-post-title">{post.title}</div>
            <div>|</div>
            <div className="temp-saved-post-content">{post.content}</div>
            <button className="bin-btn" onClick={deleteBtnHandler}>
              <IoTrashOutline />
            </button>
          </div>
        ))}
      </div>
    </button>
  );
};

export default TempSaveModal;
