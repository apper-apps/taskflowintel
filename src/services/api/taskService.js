import tasksData from "@/services/mockData/tasks.json"

let tasks = [...tasksData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const taskService = {
  async getAll() {
    await delay()
    return [...tasks].sort((a, b) => a.order - b.order)
  },

  async getById(id) {
    await delay()
    return tasks.find(task => task.Id === parseInt(id))
  },

  async create(taskData) {
    await delay()
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      completed: false,
      order: tasks.length + 1
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay()
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates }
      return { ...tasks[index] }
    }
    return null
  },

  async delete(id) {
    await delay()
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index !== -1) {
      const deleted = tasks.splice(index, 1)[0]
      return { ...deleted }
    }
    return null
  },

  async getByCategory(categoryId) {
    await delay()
    return tasks.filter(task => task.categoryId === parseInt(categoryId))
  },

  async getCompleted() {
    await delay()
    return tasks.filter(task => task.completed)
  },

  async getTodayTasks() {
    await delay()
    const today = new Date().toISOString().split("T")[0]
    return tasks.filter(task => 
      !task.completed && 
      (task.dueDate === today || !task.dueDate)
    )
  },

  async getUpcomingTasks() {
    await delay()
    const today = new Date()
    return tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) > today
    )
  },

  async toggleComplete(id) {
    await delay()
    const task = tasks.find(task => task.Id === parseInt(id))
    if (task) {
      task.completed = !task.completed
      return { ...task }
    }
    return null
  }
}