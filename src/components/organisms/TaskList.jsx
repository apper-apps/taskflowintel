import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TaskItem from "@/components/molecules/TaskItem"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { taskService } from "@/services/api/taskService"
import { categoryService } from "@/services/api/categoryService"
import { toast } from "react-toastify"

const TaskList = ({ 
  tasks: propTasks, 
  loading: propLoading, 
  error: propError,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
  onTimerToggle,
  emptyTitle = "No tasks found",
  emptyDescription = "Create your first task to get started!",
  emptyActionText = "Add Task",
  onEmptyAction,
  searchQuery = ""
}) => {
  const [tasks, setTasks] = useState(propTasks || [])
  const [loading, setLoading] = useState(propLoading || false)
  const [error, setError] = useState(propError || null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (propTasks) {
      setTasks(propTasks)
    }
  }, [propTasks])

  useEffect(() => {
    if (propLoading !== undefined) {
      setLoading(propLoading)
    }
  }, [propLoading])

  useEffect(() => {
    if (propError !== undefined) {
      setError(propError)
    }
  }, [propError])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      console.error("Failed to load categories:", err)
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId)
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.Id === taskId ? updatedTask : task
        ))
        
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask)
        }

        toast.success(
          updatedTask.completed ? "Task completed!" : "Task reopened!",
          { autoClose: 2000 }
        )
      }
    } catch (err) {
      toast.error("Failed to update task")
      console.error("Error toggling task:", err)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      
      if (onTaskDelete) {
        onTaskDelete(taskId)
      }

      toast.success("Task deleted successfully")
    } catch (err) {
      toast.error("Failed to delete task")
      console.error("Error deleting task:", err)
    }
  }

  const getCategoryForTask = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId)
  }

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
    )
  })

  const retry = () => {
    if (onTaskUpdate) {
      onTaskUpdate()
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={retry} />
  }

  if (filteredTasks.length === 0) {
    return (
      <Empty
        title={searchQuery ? "No matching tasks" : emptyTitle}
        description={searchQuery ? `No tasks match "${searchQuery}"` : emptyDescription}
        actionText={!searchQuery ? emptyActionText : undefined}
        onAction={!searchQuery ? onEmptyAction : undefined}
      />
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task) => (
<TaskItem
            key={task.Id}
            task={task}
            category={getCategoryForTask(task.categoryId)}
            onToggleComplete={handleToggleComplete}
            onEdit={onTaskEdit}
            onDelete={handleDeleteTask}
            onTimerToggle={onTimerToggle}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList