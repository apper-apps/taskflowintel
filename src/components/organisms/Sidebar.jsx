import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Categories from "@/components/pages/Categories";
import CategoryItem from "@/components/molecules/CategoryItem";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const [taskCounts, setTaskCounts] = useState({})
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [allTasks, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      setCategories(categoriesData)

      const today = new Date().toISOString().split("T")[0]
      const counts = {
        all: allTasks.filter(t => !t.completed).length,
        today: allTasks.filter(t => !t.completed && (t.dueDate === today || !t.dueDate)).length,
        upcoming: allTasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) > new Date()).length,
        completed: allTasks.filter(t => t.completed).length
      }

      setTaskCounts(counts)
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  const sidebarItems = [
    {
      icon: "List",
      label: "All Tasks",
      to: "/all",
      count: taskCounts.all
    },
    {
      icon: "Calendar",
      label: "Today",
      to: "/today",
      count: taskCounts.today
    },
    {
      icon: "Clock",
      label: "Upcoming",
      to: "/upcoming",
      count: taskCounts.upcoming
    },
    {
      icon: "Folder",
      label: "Categories",
      to: "/categories"
    },
    {
      icon: "CheckCircle",
      label: "Completed",
      to: "/completed",
      count: taskCounts.completed
    }
  ]

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex h-full w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-900 to-primary-700 rounded-xl flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-gray-900">TaskFlow</h1>
            <p className="text-sm text-gray-600">Organize your day</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <CategoryItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              count={item.count}
            />
          ))}
        </div>

        {categories.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <div className="space-y-2">
{categories.slice(0, 5).map((category) => (
                <CategoryItem
                  key={category.Id}
                  icon={category.icon}
                  label={category.Name || category.name}
                  to={`/categories?id=${category.Id}`}
                  color={category.color}
                />
              ))}
            </div>
</div>
        )}
        
        <div className="mt-auto pt-6 border-t border-gray-200">
          <LogoutButton />
        </div>
      </nav>
    </div>
  )

  // Mobile Sidebar with logout
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-xl"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-900 to-primary-700 rounded-xl flex items-center justify-center">
                    <ApperIcon name="CheckSquare" size={20} className="text-white" />
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-xl text-gray-900">TaskFlow</h1>
                    <p className="text-sm text-gray-600">Organize your day</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="X" size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <nav className="flex-1 p-6 flex flex-col h-full">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <CategoryItem
                    key={item.to}
                    icon={item.icon}
                    label={item.label}
                    to={item.to}
                    count={item.count}
                  />
                ))}
              </div>

              {categories.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2">
{categories.slice(0, 5).map((category) => (
                      <CategoryItem
                        key={category.Id}
                        icon={category.icon}
                        label={category.Name || category.name}
                        to={`/categories?id=${category.Id}`}
                        color={category.color}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-auto pt-6 border-t border-gray-200">
                <LogoutButton />
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // Logout Button Component
  const LogoutButton = () => {
    const { logout } = useContext(AuthContext);
    
    return (
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
      >
        <ApperIcon name="LogOut" size={20} />
        <span className="flex-1 text-left">Logout</span>
      </button>
    );
};

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar