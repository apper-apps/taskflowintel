import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <button
      type="button"
      className={cn(
        "w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
        checked ? "bg-accent-500 border-accent-500" : "bg-white hover:border-primary-400",
        className
      )}
      onClick={onChange}
      ref={ref}
      {...props}
    >
      {checked && (
        <ApperIcon 
          name="Check" 
          size={12} 
          className="text-white" 
        />
      )}
    </button>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox