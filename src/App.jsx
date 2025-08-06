import { Routes, Route } from "react-router-dom"
import { Layout } from "antd"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Dashboard from "./pages/Dashboard"
import CasesList from "./pages/CasesList"
import AddCase from "./pages/AddCase"
import ClientsList from "./pages/ClientsList"
import AddClient from "./pages/AddClient"
import AddCourt from "./pages/AddCourt"
import ViewCase from "./pages/ViewCase"
import CourtList from "./pages/CourtList"
import CaseDocumentViewer from "./pages/ClientCaseList"
import ClientAddCase from "./pages/ClientAddCase"
import CourtCaseLsit from "./pages/CourtCaseLsit"

const { Content } = Layout

function App() {
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        {/* <Header /> */}
        <Content className="p-6 bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases" element={<CasesList />} />
            <Route path="/cases/add" element={<AddCase />} />
            <Route path="/cases/add/:clientId" element={<ClientAddCase />} />
            <Route path="/cases/:id" element={<ViewCase />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/clients/add" element={<AddClient />} />
            <Route path="/courts" element={<CourtList />} />
            <Route path="/courts/add" element={<AddCourt />} />
            <Route path="/client-cases/:id" element={<CaseDocumentViewer />} />
            <Route path="/court-cases/:id" element={<CourtCaseLsit />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
