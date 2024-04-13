import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./update.module.scss";

const EditPage: React.FC = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [about, setAbout] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageToServer = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
        // 추가적인 헤더나 인증 정보를 설정할 수 있습니다.
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      return data.imageUrl; // 서버에서 반환된 이미지 URL
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const imageUrl = await uploadImageToServer(file);
        setProfileImage(imageUrl);
        alert("이미지가 성공적으로 업로드되었습니다.");
      } catch (error) {
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handleSave = async () => {
    try {
      await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 필요하다면 인증 헤더를 추가하세요.
        },
        body: JSON.stringify({
          name,
          nickname,
          about,
          profileImage,
        }),
      });

      navigate("/my");
    } catch (error) {
      console.error("Error updating user data: ", error);
      alert("프로필 정보 업데이트에 실패했습니다.");
    }
  };

  // 기본 이미지로 변경하는 로직도 서버와의 상호작용을 필요로 할 수 있으나,
  // 여기서는 간단히 클라이언트 사이드에서만 처리하는 것으로 가정합니다.
  const handleSetDefaultImage = async () => {
    // 기본 이미지 URL 설정
    const defaultImageUrl = "/images/default_profile_pic.png";
    setProfileImage(defaultImageUrl);
    alert("프로필 이미지가 기본 이미지로 변경되었습니다.");
  };

  return (
    // JSX 마크업은 기본적으로 동일하게 유지됩니다.
    <div className={styles["edit-page"]}>
      <div className={styles["profile-pic-container"]}>
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className={styles["profile-image"]}
          />
        ) : (
          <img
            src="/images/default_profile_pic.png"
            alt="Profile"
            className={styles["profile-image"]}
          />
        )}
        <button
          className={styles["profile-pic-button"]}
          onClick={() => fileInputRef.current?.click()}
        >
          +
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload} // 파일이 선택되면 이미지 업로드 핸들러 실행
        />
      </div>
      <div className={styles["input-container"]}>
        <label>
          이름 (필수)
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20} // 최대 글자 수 제한
          />
        </label>
        <label>
          닉네임 (필수)
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={40} // 최대 글자 수 제한
          />
        </label>
        <label>
          자기소개
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            maxLength={150} // 최대 글자 수 제한
          />
        </label>
        <button onClick={handleSetDefaultImage}>기본 이미지로 변경</button>
        <button onClick={handleSave}>저장</button>
      </div>
    </div>
  );
};

export default EditPage;
