import React from "react";
import { Layout } from "antd";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntHeader className="glass bg-white/25 backdrop-blur-lg shadow-lg border-b-2 border-green-600 px-4 py-3 lg:px-12">
      <h3 className="text-center sm:text-2xl md:text-4xl lg:text-3xl font-semibold text-green-800">
        PASmartSuite
      </h3>
    </AntHeader>
  );
};

export default Header;
