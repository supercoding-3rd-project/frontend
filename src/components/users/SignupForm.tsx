import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.scss";
import { Link } from "react-router-dom";
import TermsPopup from "../TermsPopup";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  const navigate = useNavigate();

  // 타입을 'string'으로 명시
  const validateEmail = (email: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // 타입을 'string'으로 명시
  const validateUsername = (username: string) => {
    const length = new TextEncoder().encode(username).length;
    if (length < 4 || length > 10) {
      setUsernameError("닉네임은 4~10자 내외여야 합니다.");
      return false;
    }
    setUsernameError("");
    return true;
  };

  // 타입을 'string'으로 명시
  const validatePassword = (password: string) => {
    // 특수 문자를 포함하도록 정규 표현식을 수정합니다.
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/;
    if (!regex.test(password)) {
      setPasswordError(
        "비밀번호는 8~20자이며, 영문자, 숫자, 특수문자(!@#$%^&*())를 각각 최소 하나 이상 포함해야 합니다."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  // 타입을 'string'으로 명시
  const checkPasswordMatch = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleTermsClick = () => {
    setShowTermsPopup(true);
  };

  // 타입을 'React.FormEvent<HTMLFormElement>'로 명시
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      validateEmail(email) &&
      validateUsername(username) &&
      validatePassword(password) &&
      checkPasswordMatch(password, confirmPassword) &&
      termsAgreed
    ) {
      try {
        // 회원가입 요청 로직
        const signupResponse = await fetch(
          "http://13.209.98.14:8080/api/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
              username,
            }),
          }
        );

        if (!signupResponse.ok) {
          throw new Error("회원가입 요청 실패");
        }

        // 회원가입 성공 후 로그인 요청 로직
        const loginResponse = await fetch(
          "http://13.209.98.14:8080/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        if (!loginResponse.ok) {
          throw new Error("로그인 요청 실패");
        }

        const { accessToken, refreshToken } = await loginResponse.json();
        // 토큰 저장 로직
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 로그인 성공 후 메인 페이지로 이동
        navigate("/");
      } catch (error) {
        console.error("오류 발생:", error);
        // 오류 처리 로직, 예: 사용자에게 오류 메시지 표시
      }
    } else {
      alert("입력 조건을 확인해주세요.");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            placeholder="이메일 주소를 입력해주세요."
            value={email}
            onBlur={() => !email && setEmailError("이메일을 입력해주세요.")}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />
          {emailError && (
            <div className={styles.errorMessage}>{emailError}</div>
          )}
        </div>
        <div>
          <label htmlFor="username">닉네임</label>
          <input
            type="text"
            id="username"
            placeholder="닉네임을 입력해주세요."
            value={username}
            onBlur={() =>
              !username && setUsernameError("닉네임을 입력해주세요.")
            }
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError("");
            }}
          />
          {usernameError && (
            <div className={styles.errorMessage}>{usernameError}</div>
          )}
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onBlur={() =>
              !password && setPasswordError("패스워드를 입력해주세요.")
            }
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
          />
          {passwordError && (
            <div className={styles.errorMessage}>{passwordError}</div>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="비밀번호를 다시 한 번 입력해주세요."
            value={confirmPassword}
            onBlur={() =>
              !confirmPassword &&
              setConfirmPasswordError("패스워드를 입력해주세요.")
            }
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError("");
            }}
          />
          {confirmPasswordError && (
            <div className={styles.errorMessage}>{confirmPasswordError}</div>
          )}
        </div>
        <div className={`${styles.checkboxContainer} ${styles.checkbox}`}>
          <input
            className={styles.customCheckbox}
            type="checkbox"
            id="termsAgreed"
            checked={termsAgreed}
            onChange={(e) => setTermsAgreed(e.target.checked)}
          />
          <span onClick={handleTermsClick} className={styles.checkboxLabel}>
            (필수) 개인정보 수집 및 이용약관 동의
          </span>
        </div>
        <button type="submit" className={styles.signupButton}>
          회원가입
        </button>
      </form>
      <div className={styles.signupPrompt}>
        <span className={styles.signupText}>계정이 있으신가요?</span>
        <Link to="/users/login" className={styles.signupLink}>
          로그인하기
        </Link>
      </div>
      {showTermsPopup && (
        <TermsPopup onClose={() => setShowTermsPopup(false)} />
      )}
    </div>
  );
};

export default Signup;
