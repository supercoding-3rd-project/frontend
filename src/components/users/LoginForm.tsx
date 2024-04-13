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
        // 서버가 응답하지 않을 경우를 위한 조건부 처리
        // 예를 들어 response.status가 0이면 네트워크 오류로 간주할 수 있습니다.
        if (response.status === 0) {
          // 임의의 토큰 생성하여 로컬 스토리지에 저장
          console.warn("서버가 응답하지 않습니다. 임의의 토큰으로 대체합니다.");
          const dummyToken = "임의의토큰";
          localStorage.setItem("userToken", dummyToken);
          navigate("/");
          return;
        } else {
          throw new Error(`로그인 요청 실패: ${response.status}`);
        }
      }

      // 서버가 정상적으로 응답할 경우의 처리
      const data = await response.json();
      if (!data.token) {
        throw new Error("서버에서 토큰을 제대로 반환하지 않음");
      }
      localStorage.setItem("userToken", data.token);
      navigate("/");
    } catch (error) {
      console.error("로그인 에러:", error);
      // 에러 처리, 예를 들어 사용자에게 에러 메시지 표시
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>로그인</h2>
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
          {emailError && <div style={{ color: "red" }}>{emailError}</div>}
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
          {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
        </div>
        <div className={styles.signupPrompt}>
          <span className={styles.signupText}>계정이 없으신가요?</span>
          <Link to="/users/signup" className={styles.signupLink}>
            회원가입하기
          </Link>
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
