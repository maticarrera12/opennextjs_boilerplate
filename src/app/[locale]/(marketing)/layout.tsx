import React from "react";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/comp-582";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default layout;
