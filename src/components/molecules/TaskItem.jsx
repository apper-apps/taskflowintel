import { useState } from "react"
import { motion } from "framer-motion"
import { format, isToday, isPast } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Checkbox from "@/components/atoms/Checkbox"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  category 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleToggleComplete = async () => {
    setIsCompleting(true)
    await onToggleComplete(task.Id)
    setTimeout(() => setIsCompleting(false), 300)
  }

  const getPriorityVariant = (priority) => {
    const variants = {
      high: "high",
      medium: "medium", 
      low: "low"
    }
    return variants[priority] || "default"
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    const date = new Date(dueDate)
    if (isToday(date)) return "Today"
    return format(date, "MMM d")
  }

  const isDueToday = task.dueDate && isToday(new Date(task.dueDate))
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isCompleting ? 0.98 : 1 
      }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "task-card group",
        `priority-${task.priority}`,
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-gray-900 mb-1",
                task.completed && "line-through"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mb-3",
                  task.completed && "line-through"
                )}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-3">
                {category && (
                  <div className="flex items-center gap-1.5">
                    <ApperIcon 
                      name={category.icon} 
                      size={14} 
                      style={{ color: category.color }}
                    />
                    <span className="text-xs text-gray-500">
                      {category.name}
                    </span>
                  </div>
                )}

                <Badge variant={getPriorityVariant(task.priority)}>
                  {task.priority}
                </Badge>

                {task.dueDate && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    isDueToday && "text-orange-600 font-medium",
                    isOverdue && !task.completed && "text-red-600 font-medium",
                    !isDueToday && !isOverdue && "text-gray-500"
                  )}>
                    <ApperIcon name="Calendar" size={12} />
                    {formatDueDate(task.dueDate)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="p-2"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.Id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem