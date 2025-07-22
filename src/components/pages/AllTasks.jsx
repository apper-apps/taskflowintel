import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import TaskList from '@/components/organisms/TaskList'
import Header from '@/components/organisms/Header'
import TaskModal from '@/components/organisms/TaskModal'
import QuickAddButton from '@/components/molecules/QuickAddButton'
import { taskService } from "@/services/api/taskService";

const AllTasks = () => {
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
      const data = await taskService.getAll()
      setTasks(data.filter(task => !task.completed))
    } catch (err) {
      setError("Failed to load tasks")
      console.error("Error loading tasks:", err)
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
    if (selectedTask) {
      setTasks(prev => prev.map(task => 
        task.Id === savedTask.Id ? savedTask : task
      ))
    } else {
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

  const activeTasks = tasks.filter(task => !task.completed)

  return (
    <div className="flex flex-col h-full">
      {({ onToggleMobileSidebar }) => (
        <>
          <Header
            title="All Tasks"
            subtitle={`${activeTasks.length} active tasks`}
            onSearch={handleSearch}
            onAddTask={handleAddTask}
            onToggleMobileSidebar={onToggleMobileSidebar}
          />
          
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6">
<TaskList
                tasks={activeTasks}
                loading={loading}
                error={error}
                searchQuery={searchQuery}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onTaskEdit={handleEditTask}
                onTimerToggle={handleTimerToggle}
                onEmptyAction={handleAddTask}
                emptyTitle="No active tasks"
                emptyDescription="All your tasks are complete, or create your first task to get started!"
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
        </>
      )}
    </div>
  )
}

export default AllTasks