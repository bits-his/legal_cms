import React from "react";
import { Layout } from "antd";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntHeader className="glass bg-white/25 backdrop-blur-lg shadow-lg border-b-2 border-green-600 px-4 py-3 lg:px-12">
      <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-green-800">
        {/* Auwal I Magashi & Co. */}
      </h1>
    </AntHeader>
  );
};

export default Header;
