import { useState } from "react"
import Sidebar from "@/components/organisms/Sidebar"

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev)
  }

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={closeMobileSidebar}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-hidden">
          {typeof children === "function" 
            ? children({ onToggleMobileSidebar: toggleMobileSidebar })
            : children
          }
        </main>
      </div>
    </div>
  )
}

export default Layout