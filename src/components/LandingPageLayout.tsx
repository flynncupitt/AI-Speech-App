import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
