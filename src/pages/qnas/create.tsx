import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./create.scss";

import { CgAddR } from "react-icons/cg";
import { MdCancel } from "react-icons/md";
import { Editor } from "@toast-ui/react-editor";
import EditorComponent from "../../components/qnas/EditorComponent";
import TempSaveModal from "src/components/qnas/TempSaveModal";
import axios from "axios";

export default function QnaCreatePage() {
  //추후 수정 필요
  const apiUrl: string = "https://ade8-218-233-42-240.ngrok-free.app";

  //title
  const [title, setTitle] = useState("");
  //editor contents
  const [content, setContent] = useState("");
  //버튼 클릭시 (content상태값 바뀔때마다) 콘솔찍기
  useEffect(() => {
    console.log("Content updated:", content);
  }, [content]);
  const [isTitleBtnClicked, setIsTitleBtnClicked] = useState(false);
  //count the number of the title
  const [titleCount, setTitleCount] = useState(0);
  //에디터 입력값 가져오기
  const editorRef = useRef<Editor>(null);
  //타이틀 내용 변경여부 확인 - 저장,제출버튼 활성화 여부 판단 위함
  const [isTitleChanged, setIsTitleChanged] = useState(false);
  //에디터 내용 변경여부 확인 - 저장,제출버튼 활성화 여부 판단 위함
  const [isContentChanged, setIsContentChanged] = useState(false);
  //저장버튼 활성화 여부
  const inputTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    setTitleCount(newTitle.length);
    setIsTitleChanged(newTitle.trim() !== "");
  };

  interface SaveSubmitPosts {
    tempId: number;
    title: string;
    content: string;
    createdAt?: "2024-04-16...";
  }

  const tempSavedPostsMockData: SaveSubmitPosts[] = [
    {
      tempId: 1,
      title: "임시저장제목1",
      content: "임시저장글1",
      createdAt: "2024-04-16...",
    },
    {
      tempId: 2,
      title: "임시저장제목2",
      content: "임시저장글2",
      createdAt: "2024-04-16...",
    },
  ];

  /////완료 버튼 클릭시 (글 제출)/////
  //POST요청 보내기 + 헤더의 questionId값 받아서 그 페이지로 이동

  const submitClickHandler = () => {
    const postData = {
      title: title,
      content: content,
      statusType: "SUBMIT",
    };
    try {
      axios
        .post(
          `https://cors-anywhere.herokuapp.com/${apiUrl}/v1/question/create/submit`,
          postData
        )
        .then((response) => {
          console.log("글 제출 POST 요청 성공:", response.data);

          // 응답 데이터로부터 ID 값을 추출
          const newPostId = response.data.questionId; // 응답 데이터의 ID 키에 따라 조정

          // 새로운 페이지 URL 생성, 해당 페이지로 이동
          const newPageUrl = `${apiUrl}/qnas/${newPostId}`; // 수정필요

          // 페이지 이동
          window.location.href = newPageUrl;
        })
        .catch((error) => {
          console.error("글 제출 POST 요청 실패:", error);
        });
    } catch (error) {
      console.error("글 제출 요청 중 예기치 않은 오류 발생:", error);
    }
  };

  /////임시저장 관련/////

  //임시저장된 글들
  const [tempSavedPosts, setTempSavedPosts] = useState<SaveSubmitPosts[]>([]);
  //임시저장된 글들이 있는지 여부를 나타내는 상태
  const [isTempSavedPostPresent, setIsTempSavedPostPresent] = useState(true);
  //임시저장 글을 GET요청하여 저장된 글이 있을 경우 불러오는 로직
  const savedPostRequest = () => {
    const userBearer =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBY2Nlc3NUb2tlbiIsImV4cCI6MTcxMzQ0NDU1OSwiZW1haWwiOiJ0b25lbGxkb0BuYXZlci5jb20ifQ. -X6sCmOPlCc87RGBNhp9UFBBJSzdnn58qIStuSQNEC4Xlv01Nb1-pgMDPPiSdBCa5X_kooCwSfRIgHGlDbTwDg";
    axios
      .get(`https://cors-anywhere.herokuapp.com/${apiUrl}/v1/question/create`, {
        headers: {
          "ngrok-skip-browser-warning": "any-value", //삭제예정
          Authorization: `Bearer ${userBearer}`,
        },
      })

      .then((response) => {
        if (response.data.length > 0) {
          setTempSavedPosts(response.data);
          setIsTempSavedPostPresent(true);
          console.log("임시저장 글 get요청 성공", response.data);
        } else {
          setIsTempSavedPostPresent(false);
        }
      })
      .catch((error) => {
        setTempSavedPosts(tempSavedPostsMockData); //수정필요. 나중에 mockdata지우기
        console.log("임시저장 글 get요청 성공");
      });
  };

  //임시저장 버튼 눌렀을때
  const tempSaveBtnHandler = async () => {
    try {
      // 임시 저장할 데이터
      const tempPostData = {
        title: title,
        content: content,
        statusType: "TEMP_SAVE",
      };
      // 임시 저장 요청 보내기
      await axios.patch(`${apiUrl}/v1/question/create/temp`, tempPostData); //추후 수정필요
      // 최신 글 목록 다시 가져오기
      await savedPostRequest();
    } catch (error) {
      console.error("임시 저장 실패:", error);
    }
  };
  //임시저장글 삭제버튼 클릭시
  const deleteBtnHandler = async () => {
    try {
      await axios.patch(`api/v1/question/temp/{post.tempId}/delete`);
      //업데이트 된 임시저장 리스트 GET요청
      await savedPostRequest();
    } catch (error) {
      console.error("임시 저장된 글 삭제 실패:", error);
      alert("앗! 삭제하는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
    return false; //기본동작취소
  };

  //페이지 진입시 임시저장 글이 있을 경우 받아오기.추후 수정필요
  useEffect(() => {
    savedPostRequest();
  }, []);

  //open modal when temporary save storage clicked
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalOpenHandler = () => {
    setIsModalOpen(true);
  };

  //when title cancel button clicked
  const cancelBtnClickHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    setIsTitleBtnClicked(false);
    setTitle("");
    setTitleCount(0);
  };

  //state changed when title and content are present (->enable save/submit button)
  const editorChangeHandler = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance(); //instance provided by Toast UI
      const updatedContent = editorInstance.getMarkdown(); //markdown content
      setContent(updatedContent);

      setIsContentChanged(
        updatedContent !== "" &&
          updatedContent !==
            "나누고 싶은 생각을 적어주세요. 작성 완료 버튼 클릭 후에는 수정할 수 없어요."
      );
    }
  };

  //버튼 활성화 여부에 따라서 클래스 동적으로 변경
  const getButtonClassName = () => {
    return isTitleChanged && isContentChanged ? "btn-enabled" : "btn-disabled";
  };

  return (
    <div className="qna-create-page-layout">
      <div className="header">
        {isTempSavedPostPresent && (
          <button className="temporary-storage-btn" onClick={modalOpenHandler}>
            임시보관함
          </button>
        )}

        {isModalOpen && (
          <TempSaveModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            tempSavedPosts={tempSavedPosts}
            deleteBtnHandler={deleteBtnHandler}
          />
        )}

        <button
          className={`save-btn ${getButtonClassName()}`}
          disabled={!isTitleChanged || !isContentChanged}
          onClick={tempSaveBtnHandler}
        >
          임시저장
        </button>
        <button
          className={`submit-btn ${getButtonClassName()}`}
          onClick={submitClickHandler}
          disabled={!isTitleChanged || !isContentChanged}
        >
          완료
        </button>
      </div>
      <div className="write-wrapper">
        {!isTitleBtnClicked ? (
          <div className="title-add-wrapper">
            <button
              className="title-add-btn"
              onClick={() => setIsTitleBtnClicked(true)}
            >
              <CgAddR />
              제목추가
            </button>
          </div>
        ) : (
          <div className="title-add-wrapper">
            <div>
              <button
                className="title-cancel-btn"
                onClick={cancelBtnClickHandler}
              >
                <MdCancel />
                취소
              </button>
              <div className="count-title">
                <span>{titleCount}</span>
                <span> /40</span>
              </div>
            </div>

            <input
              className="input-title"
              type="text"
              name="input-title"
              id="input-title"
              value={title}
              onChange={inputTitleHandler}
              placeholder="제목을 입력하세요"
              maxLength={39}
              autoFocus
            />
          </div>
        )}

        <div className="editor-box">
          <EditorComponent ref={editorRef} onChange={editorChangeHandler} />
        </div>
      </div>
    </div>
  );
}
