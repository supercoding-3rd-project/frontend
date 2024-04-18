import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  isLoggedIn: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isLoggedIn }) => {
  return (
    <div className="layout">
      <Header isLoggedIn={isLoggedIn} />
      {children}
      <Footer />
    </div>
  );
};
