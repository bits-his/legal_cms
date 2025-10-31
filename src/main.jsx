import React from "react"
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"
import { ConfigProvider } from "antd"
import App from "./App.jsx"
import "./index.css"

const theme = {
  token: {
    colorPrimary: "#009A44", // Nigeria green
    borderRadius: 6,
    colorBgContainer: "#ffffff", // White background
  },
  components: {
    Button: {
      colorPrimary: "#009A44", // Primary green for buttons
      colorPrimaryHover: "#006B2D", // Darker green on hover
      colorPrimaryActive: "#006B2D", // Darker green when active
      colorBgContainer: "#ffffff", // White background
    },
    Layout: {
      colorBgHeader: "#ffffff", // White header
      colorBgBody: "#f9fafb", // Light gray body background
    },
    Menu: {
      colorItemBg: "#ffffff", // White menu items
      colorItemHoverBg: "#f0fdf4", // Light green on hover
      colorItemActiveBg: "#f0fdf4", // Light green when active
      colorText: "rgba(0, 0, 0, 0.88)", // Dark text
      colorTextSelected: "#009A44", // Green when selected
      colorTextHover: "#009A44", // Green on hover
    },
    Card: {
      colorBgContainer: "#ffffff", // White card background
    },
    Table: {
      headerBg: "#f0fdf4", // Light green header background
      headerColor: "rgba(0, 0, 0, 0.88)", // Dark text in header
      rowHoverBg: "#f0fdf4", // Light green on row hover
    },
    Input: {
      colorBgContainer: "#ffffff", // White input background
      colorBorder: "#d1d5db", // Light gray border
    },
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
