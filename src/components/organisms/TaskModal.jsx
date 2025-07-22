import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import TaskForm from "@/components/molecules/TaskForm"
import { taskService } from "@/services/api/taskService"
import { toast } from "react-toastify"

const TaskModal = ({ isOpen, onClose, task, onTaskSaved }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    try {
      let savedTask

      if (task) {
        savedTask = await taskService.update(task.Id, formData)
        toast.success("Task updated successfully!")
      } else {
        savedTask = await taskService.create(formData)
        toast.success("Task created successfully!")
      }

      if (savedTask && onTaskSaved) {
        onTaskSaved(savedTask)
      }

      onClose()
    } catch (error) {
      toast.error(task ? "Failed to update task" : "Failed to create task")
      console.error("Error saving task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  {task ? "Edit Task" : "Create New Task"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <TaskForm
                  task={task}
                  onSubmit={handleSubmit}
                  onCancel={onClose}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default TaskModal