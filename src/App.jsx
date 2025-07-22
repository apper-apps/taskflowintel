import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import AllTasks from "@/components/pages/AllTasks"
import TodayTasks from "@/components/pages/TodayTasks"
import UpcomingTasks from "@/components/pages/UpcomingTasks"
import Categories from "@/components/pages/Categories"
import CompletedTasks from "@/components/pages/CompletedTasks"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Layout>
          <Routes>
            <Route path="/" element={<TodayTasks />} />
            <Route path="/all" element={<AllTasks />} />
            <Route path="/today" element={<TodayTasks />} />
            <Route path="/upcoming" element={<UpcomingTasks />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/completed" element={<CompletedTasks />} />
          </Routes>
        </Layout>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
      </div>
    </Router>
  )
}

export default App