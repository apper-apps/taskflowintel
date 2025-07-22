import { useState } from "react"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ onSearch, placeholder = "Search tasks..." }) => {
  const [query, setQuery] = useState("")

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <ApperIcon name="Search" size={18} className="text-gray-400" />
      </div>
      <Input
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ApperIcon name="X" size={16} className="text-gray-400" />
        </button>
      )}
    </div>
  )
}

export default SearchBar