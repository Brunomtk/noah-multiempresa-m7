import type React from "react"
import { Sidebar } from "antd"

const ProfessionalSidebar: React.FC = () => {
  return (
    <Sidebar>
      <Sidebar.Item>Dashboard</Sidebar.Item>
      <Sidebar.Item>Schedule</Sidebar.Item>
      <Sidebar.Item>Check</Sidebar.Item>
      <Sidebar.Item>History</Sidebar.Item>
      <Sidebar.Item>Materials</Sidebar.Item>
      <Sidebar.Item>Performance</Sidebar.Item>
      <Sidebar.Item>Feedback</Sidebar.Item>
      <Sidebar.Item>Chat</Sidebar.Item>
      <Sidebar.Item>Profile</Sidebar.Item>
      <Sidebar.Item>Notifications</Sidebar.Item>
    </Sidebar>
  )
}

export default ProfessionalSidebar
