import React from "react";
import { Layout } from "antd";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntHeader className="glass bg-white/25 backdrop-blur-lg shadow-lg border-b-2 border-green-600 px-4 py-3 lg:px-12">
      <h1 className="text-center text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold text-green-800">
        PASmartSuite
      </h1>
    </AntHeader>
  );
};

export default Header;
