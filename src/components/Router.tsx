import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/users/login";
import SignupPage from "../pages/users/signup";
import HomePage from "../pages/home";
import MyPage from "../pages/my";
import MyPageUpdate from "../pages/my/update";
import MessengerService from "../pages/messenger";
import NotificationsPage from "../pages/notifications";
import SearchPage from "../pages/search";
import QnaListPage from "../pages/qnas";
import QnaCreatePage from "../pages/qnas/create";
import QnaDetailPage from "../pages/qnas/detail";
import UserPage from "../pages/otherprofile/Userpage";
import IntroPage from "../pages/intro/intro";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/my" element={<MyPage />} />
      <Route path="/my/update" element={<MyPageUpdate />} />
      <Route path="/users/login" element={<LoginPage />} />
      <Route path="/users/:username" element={<UserPage />} />
      <Route path="/users/signup" element={<SignupPage />} />
      <Route path="/messenger" element={<MessengerService />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/qnas" element={<QnaListPage />} />
      <Route path="/qnas/:id" element={<QnaDetailPage />} />
      <Route path="/qnas/create/:userid" element={<QnaCreatePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/intro" element={<IntroPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
