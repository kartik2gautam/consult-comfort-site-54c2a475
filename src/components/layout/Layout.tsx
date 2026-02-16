import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MarketingChatbot from "../MarketingChatbot";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <MarketingChatbot />
    </div>
  );
};

export default Layout;
