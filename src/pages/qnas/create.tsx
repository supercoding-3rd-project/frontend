import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./create.scss";

import { CgAddR } from "react-icons/cg";
import { MdCancel } from "react-icons/md";
import { Editor } from "@toast-ui/react-editor";
import EditorComponent from "../../components/qnas/EditorComponent";
import TempSaveModal from "src/components/qnas/TempSaveModal";
import axios from "axios";

export default function QnaCreatePage() {
  //현재 파이어베이스. 추후 수정 필요
  const apiUrl =
    "https://supercoding-3rd-pj-test-default-rtdb.firebaseio.com/.json";

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

  interface tempPosts {
    post_id: number;
    title: string;
    content: string;
  }

  const tempSavedPosts: tempPosts[] = [
    {
      post_id: 1,
      title: "임시저장제목1",
      content: "임시저장글1",
    },
    {
      post_id: 2,
      title: "임시저장제목2",
      content: "임시저장글2",
    },
  ];

  //임시저장된 글들
  const [tempSaved, setTempSaved] = useState<tempPosts[]>(tempSavedPosts);
  //임시저장된 글들이 있는지 여부를 나타내는 상태
  const [isTempSavedPostPresent, setIsTempSavedPostPresent] = useState(true);

  const deleteBtnHandler = () => {
    const postData = {
      status: "delete",
      deleted_at: new Date(),
    };
    axios
      .post(apiUrl, postData)
      .then((response) => {
        console.log("임시저장 글 delete request성공:", postData);
      })
      .catch((error) => {
        console.error("임시저장 글 delete request실패:", error);
      });
  };
  //when mounted get temporary saved posts if there are.추후수정필요
  useEffect(() => {
    const getSavedPostRequest = async () => {
      try {
        const response = await axios.get("api/end-point");
        const savedPosts = response.data;

        if (savedPosts.length > 0) {
          setIsTempSavedPostPresent(true);
          console.log("임시저장 글 GET 요청 성공");
        }
      } catch (error) {
        console.error("임시저장 글 GET 요청 실패", error);
      }
    };
    getSavedPostRequest();
  }, [tempSaved]);

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

  const tempSaveBtnHandler = () => {
    const postData = {
      title: title,
      markdown_content: content,
      status: "save",
      created_at: new Date(),
    };
    axios
      .post(apiUrl, postData)
      .then((response) => {
        console.log("save request successful:", postData);
      })
      .catch((error) => {
        console.error("save request fail:", error);
      });
  };

  //when submit button clicked
  const submitClickHandler = () => {
    const postData = {
      title: title,
      markdown_content: content,
      status: "submit",
      created_at: new Date(),
    };
    axios
      .post(apiUrl, postData)
      .then((response) => {
        console.log("post request successful:", postData);
      })
      .catch((error) => {
        console.error("post request fail:", error);
      });
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
            tempSaved={tempSaved}
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
          <div>
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
