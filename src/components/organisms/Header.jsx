import { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"

const Header = ({ 
  title, 
  subtitle, 
  onSearch, 
  onAddTask, 
  onToggleMobileSidebar,
  showSearch = true,
  showAddButton = true 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <motion.h1 
              className="text-2xl font-display font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p 
                className="text-gray-600 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {showSearch && onSearch && (
            <div className="w-80 hidden md:block">
              <SearchBar onSearch={onSearch} />
            </div>
          )}
          
          {showAddButton && onAddTask && (
            <Button onClick={onAddTask} className="hidden sm:flex">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Task
            </Button>
          )}
        </div>
      </div>

      {showSearch && onSearch && (
        <div className="md:hidden mt-4">
          <SearchBar onSearch={onSearch} />
        </div>
      )}
    </div>
  )
}

export default Header