import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Header from "@/components/organisms/Header"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { categoryService } from "@/services/api/categoryService"
import { taskService } from "@/services/api/taskService"

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [taskCounts, setTaskCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ])
      
      setCategories(categoriesData)
      
      // Calculate task counts for each category
      const counts = {}
      categoriesData.forEach(category => {
        const categoryTasks = tasksData.filter(task => 
          task.categoryId === category.Id && !task.completed
        )
        counts[category.Id] = categoryTasks.length
      })
      setTaskCounts(counts)
      
    } catch (err) {
      setError("Failed to load categories")
      console.error("Error loading categories:", err)
    } finally {
      setLoading(false)
    }
  }

  const retry = () => {
    loadData()
  }

if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Categories"
          subtitle="Organize your tasks"
          showSearch={false}
          showAddButton={false}
        />
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <Loading />
          </div>
        </div>
      </div>
    )
  }

if (error) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Categories"
          subtitle="Organize your tasks"
          showSearch={false}
          showAddButton={false}
        />
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <Error message={error} onRetry={retry} />
          </div>
        </div>
      </div>
    )
  }

if (categories.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Categories"
          subtitle="Organize your tasks"
          showSearch={false}
          showAddButton={false}
        />
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <Empty
              title="No categories yet"
              description="Categories help you organize your tasks by project, context, or priority."
              actionText="Create Category"
              icon="Folder"
            />
          </div>
        </div>
      </div>
    )
  }

return (
    <div className="flex flex-col h-full">
      <Header
        title="Categories"
        subtitle={`${categories.length} categories • Organize your tasks`}
        showSearch={false}
        showAddButton={false}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                    style={{ 
                      backgroundColor: `${category.color}20`,
                      border: `2px solid ${category.color}30`
                    }}
                  >
                    <ApperIcon 
                      name={category.icon} 
                      size={24} 
                      style={{ color: category.color }}
                    />
                  </div>
                  
                  <Badge variant="default">
                    {taskCounts[category.Id] || 0} tasks
                  </Badge>
                </div>
                
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
                  {category.Name || category.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {taskCounts[category.Id] 
                    ? `${taskCounts[category.Id]} active tasks in this category`
                    : "No active tasks"
                  }
                </p>
                
                <div className="flex items-center justify-between">
                  <div 
                    className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: category.color,
                        width: taskCounts[category.Id] ? `${Math.min(taskCounts[category.Id] * 10, 100)}%` : "0%"
                      }}
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ApperIcon name="ArrowRight" size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
              <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
                Stay Organized
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Categories help you group related tasks together, making it easier to focus on specific areas of your life or work.
              </p>
              <Button variant="primary">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Create New Category
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories