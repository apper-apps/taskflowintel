import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No tasks yet", 
  description = "Create your first task to get started!",
  actionText = "Add Task",
  onAction,
  icon = "CheckSquare"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={48} className="text-primary-600" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && actionText && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionText}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty