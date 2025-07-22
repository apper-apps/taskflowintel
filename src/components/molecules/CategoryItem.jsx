import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const CategoryItem = ({ 
  icon, 
  label, 
  to, 
  count, 
  color 
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "category-item",
          isActive && "active"
        )
      }
    >
      <ApperIcon 
        name={icon} 
        size={20} 
        style={color ? { color } : undefined}
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-sm font-medium">
          {count}
        </span>
      )}
    </NavLink>
  )
}

export default CategoryItem