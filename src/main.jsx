import React from "react"
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"
import { ConfigProvider } from "antd"
import App from "./App.jsx"
import "./index.css"

const theme = {
  token: {
    colorPrimary: "#3b82f6",
    borderRadius: 6,
    colorBgContainer: "#ffffff",
  },
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
