import { useState, useEffect } from "react"
import Header from "@/components/organisms/Header"
import TaskList from "@/components/organisms/TaskList"
import { taskService } from "@/services/api/taskService"

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await taskService.getCompleted()
      setTasks(data)
    } catch (err) {
      setError("Failed to load completed tasks")
      console.error("Error loading completed tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

const handleTaskUpdate = (updatedTask) => {
    if (!updatedTask.completed) {
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
    // Completed tasks don't need timer functionality
    // This is here for consistency but won't be called
  }

  return (
    <div className="flex flex-col h-full">
      {({ onToggleMobileSidebar }) => (
        <>
          <Header
            title="Completed Tasks"
            subtitle={`${tasks.length} completed tasks`}
            onSearch={handleSearch}
            onToggleMobileSidebar={onToggleMobileSidebar}
            showAddButton={false}
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
                onTimerToggle={handleTimerToggle}
                emptyTitle="No completed tasks"
                emptyDescription="Complete some tasks to see your accomplishments here!"
                emptyActionText="View All Tasks"
                emptyIcon="CheckCircle"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CompletedTasks