import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";

export default function LoginForm() {
  // 이메일과 비밀번호 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("올바른 이메일 주소를 입력해주세요.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    // 특수 문자를 포함한 정규 표현식 추가
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'<>?,.])[A-Za-z\d!@#$%^&*()_+{}":;'<>?,.]{8,20}$/.test(
        password
      )
    ) {
      setPasswordError(
        "비밀번호는 8~20자이며, 영문자, 숫자, 특수문자를 각각 최소 하나 이상 포함해야 합니다."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 유효성 검사
    if (!validateEmail(email) || !validatePassword(password)) {
      return; // 유효성 검사에 실패한 경우, 요청을 보내지 않음
    }

    try {
      const response = await fetch("http://13.209.98.14:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`로그인 요청 실패: ${response.status}`);
      }

      // 서버가 정상적으로 응답할 경우의 처리
      const { accessToken, refreshToken } = await response.json();

      // 받은 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 메인 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("로그인 에러:", error);
      // 에러 처리, 예를 들어 사용자에게 에러 메시지 표시
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Link to="/">
        <img
          src="/images/alco_logo.png"
          alt="로고 이미지"
          className={styles.logo}
        />
      </Link>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ color: "red", textAlign: "left" }}>{emailError}</div>
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <div style={{ color: "red", textAlign: "left" }}>
              {passwordError}
            </div>
          )}
        </div>
        <button type="submit">로그인</button>
        <div className={styles.signupPrompt}>
          <span className={styles.signupText}>계정이 없으신가요?</span>
          <Link to="/users/signup" className={styles.signupLink}>
            회원가입하기
          </Link>
        </div>
      </form>
    </div>
  );
}
