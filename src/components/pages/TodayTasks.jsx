import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import TaskList from "@/components/organisms/TaskList";
import Header from "@/components/organisms/Header";
import TaskModal from "@/components/organisms/TaskModal";
import QuickAddButton from "@/components/molecules/QuickAddButton";
import { taskService } from "@/services/api/taskService";

const TodayTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await taskService.getTodayTasks()
      setTasks(data)
    } catch (err) {
      setError("Failed to load today's tasks")
      console.error("Error loading today's tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleAddTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleTaskSaved = (savedTask) => {
    const today = new Date().toISOString().split("T")[0]
    const isToday = savedTask.dueDate === today || !savedTask.dueDate
    
    if (selectedTask) {
      if (isToday && !savedTask.completed) {
        setTasks(prev => prev.map(task => 
          task.Id === savedTask.Id ? savedTask : task
        ))
      } else {
        setTasks(prev => prev.filter(task => task.Id !== savedTask.Id))
      }
    } else if (isToday && !savedTask.completed) {
      setTasks(prev => [...prev, savedTask])
    }
  }

const handleTaskUpdate = (updatedTask) => {
    if (updatedTask.completed) {
      setTasks(prev => prev.filter(task => task.Id !== updatedTask.Id))
    } else {
      setTasks(prev => prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      ))
    }
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId))
  }

  const handleTimerToggle = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleTimer(taskId)
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.Id === taskId ? updatedTask : task
        ))
        
        const action = updatedTask.timeTracking?.isActive ? "started" : "stopped"
        toast.success(`Timer ${action} for "${updatedTask.title}"`)
      }
    } catch (err) {
      toast.error("Failed to toggle timer")
      console.error("Error toggling timer:", err)
    }
  }

  const todayDate = format(new Date(), "EEEE, MMMM do")

// Handler for mobile sidebar toggle - passed to Header component
  const handleToggleMobileSidebar = () => {
    // This function can be implemented to toggle mobile sidebar
    // For now, it's a placeholder that can be connected to parent Layout
    console.log('Toggle mobile sidebar');
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Today"
        subtitle={`${todayDate} • ${tasks.length} tasks`}
        onSearch={handleSearch}
        onAddTask={handleAddTask}
        onToggleMobileSidebar={handleToggleMobileSidebar}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
<TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleEditTask}
            onTimerToggle={handleTimerToggle}
            onEmptyAction={handleAddTask}
            emptyTitle="No tasks for today"
            emptyDescription="Your day is clear! Add some tasks to stay productive."
            emptyActionText="Add Today's Task"
          />
        </div>
      </div>

      <QuickAddButton onClick={handleAddTask} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  )
}

export default TodayTasks