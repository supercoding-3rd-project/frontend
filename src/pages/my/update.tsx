import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from "react";
import styles from "./update.module.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// formData 상태를 위한 인터페이스 정의
interface FormData {
  name: string;
  nickname: string;
  about: string;
  profileImage: string;
}

interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  maxLength: number;
}

const EditPage: React.FC = () => {
  const navigate = useNavigate();
  // 폼 데이터를 위한 상태에 타입 적용
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nickname: "",
    about: "",
    profileImage: "/images/profile_default.png", // 기본 이미지 경로
  });

  // 이벤트 타입 적용
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (loadEvent: ProgressEvent<FileReader>) => {
        // loadEvent.target이 실제로 FileReader 인스턴스인지 확인합니다.
        const target = loadEvent.target as FileReader | null;
        if (target?.result) {
          setFormData((prev) => ({
            ...prev,
            profileImage: target.result as string,
          }));
        }
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 로딩 상태 설정이나 UI에 알림을 추가할 수 있습니다.

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        // 토큰이 없는 경우 로그인으로 유도
        navigate("/login");
        return;
      }

      // FormData 인스턴스를 사용하여 파일 업로드를 준비합니다.
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("nickname", formData.nickname);
      updateData.append("about", formData.about);
      // profileImage가 Base64 인코딩된 문자열이 아니라 실제 파일 객체일 경우만 추가
      if (fileInputRef.current?.files?.[0]) {
        updateData.append("profileImage", fileInputRef.current.files[0]);
      }

      // PUT 요청을 보냅니다.
      await axios.put(
        `https://api.alco4dev.com/api/v1/user/update/${userId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 성공적으로 업데이트 되었다면 사용자 정보를 로컬 스토리지에 저장
      // (이 부분은 백엔드의 실제 응답을 기반으로 할 수도 있습니다)
      localStorage.setItem("user", JSON.stringify(formData));

      // 저장 후 마이페이지로 이동
      navigate("/my");
    } catch (error) {
      console.error("사용자 정보를 업데이트하는 데 실패했습니다.", error);
      // 에러 처리 로직을 여기에 추가하세요.
    }
  };

  // 페이지 로드 시 로컬 스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setFormData(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className={styles.editPage}>
      <div className={styles.profilePicContainer}>
        <img
          src={formData.profileImage}
          alt="Profile"
          className={styles.profilePic}
        />
        <button onClick={triggerFileSelect} className={styles.profilePicButton}>
          <span>+</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className={styles.hiddenFileInput}
          accept="image/*"
        />
      </div>
      <InputGroup
        label="이름 (필수)"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        maxLength={20}
      />
      <InputGroup
        label="닉네임 (필수)"
        name="nickname"
        value={formData.nickname}
        onChange={handleInputChange}
        maxLength={40}
      />
      <InputGroup
        label="자기소개"
        name="about"
        value={formData.about}
        onChange={handleInputChange}
        maxLength={150}
      />
      <form onSubmit={handleSubmit}>
        <button type="submit" className={styles.saveButton}>
          저장
        </button>
      </form>
    </div>
  );
};

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  name,
  value,
  onChange,
  maxLength,
}) => (
  <div className={styles.inputGroup}>
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
    />
    <span className={styles.charCounter}>{`${value.length}/${maxLength}`}</span>
  </div>
);

export default EditPage;
