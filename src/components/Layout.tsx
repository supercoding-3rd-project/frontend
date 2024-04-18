import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  isLoggedIn: boolean; // isLoggedIn prop 추가
}

export const Layout: React.FC<LayoutProps> = ({ children, isLoggedIn }) => {
  return (
    <div className="layout">
      <Header isLoggedIn={isLoggedIn} /> {/* isLoggedIn prop 전달 */}
      {children}
      <Footer />
    </div>
  );
};
