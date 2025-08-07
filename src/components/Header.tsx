import React from "react";
import { Layout } from "antd";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntHeader className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 lg:px-12">
      <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-800">
        Auwal I Magashi & Co.
      </h1>
    </AntHeader>
  );
};

export default Header;
