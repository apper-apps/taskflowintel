import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const QuickAddButton = ({ onClick }) => {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-40"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        onClick={onClick}
        className="w-14 h-14 rounded-full shadow-xl bg-gradient-to-r from-primary-900 to-primary-700 hover:from-primary-800 hover:to-primary-600 border-0"
      >
        <ApperIcon name="Plus" size={24} />
      </Button>
    </motion.div>
  )
}

export default QuickAddButton