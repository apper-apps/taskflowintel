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
      
      // Stop timer when task is completed
      if (task.completed && task.timeTracking?.isActive) {
        this.stopTimer(parseInt(id))
      }
      
      return { ...task }
    }
    return null
  },

  async toggleTimer(id) {
    await delay()
    const task = tasks.find(task => task.Id === parseInt(id))
    if (!task) return null

    const now = new Date()
    
    if (!task.timeTracking) {
      task.timeTracking = {
        isActive: false,
        totalHours: 0,
        sessions: []
      }
    }

    if (task.timeTracking.isActive) {
      // Stop timer
      const activeSession = task.timeTracking.sessions.find(s => !s.endTime)
      if (activeSession) {
        activeSession.endTime = now.toISOString()
        const sessionHours = (now - new Date(activeSession.startTime)) / (1000 * 60 * 60)
        task.timeTracking.totalHours += sessionHours
      }
      task.timeTracking.isActive = false
      
      // Clear from localStorage
      const activeTimers = JSON.parse(localStorage.getItem('activeTimers') || '{}')
      delete activeTimers[task.Id]
      localStorage.setItem('activeTimers', JSON.stringify(activeTimers))
    } else {
      // Start timer
      task.timeTracking.isActive = true
      task.timeTracking.sessions.push({
        startTime: now.toISOString()
      })
      
      // Store in localStorage for persistence
      const activeTimers = JSON.parse(localStorage.getItem('activeTimers') || '{}')
      activeTimers[task.Id] = now.toISOString()
      localStorage.setItem('activeTimers', JSON.stringify(activeTimers))
    }

    return { ...task }
  },

  stopTimer(id) {
    const task = tasks.find(task => task.Id === parseInt(id))
    if (task && task.timeTracking?.isActive) {
      const now = new Date()
      const activeSession = task.timeTracking.sessions.find(s => !s.endTime)
      if (activeSession) {
        activeSession.endTime = now.toISOString()
        const sessionHours = (now - new Date(activeSession.startTime)) / (1000 * 60 * 60)
        task.timeTracking.totalHours += sessionHours
      }
      task.timeTracking.isActive = false
      
      // Clear from localStorage
      const activeTimers = JSON.parse(localStorage.getItem('activeTimers') || '{}')
      delete activeTimers[task.Id]
      localStorage.setItem('activeTimers', JSON.stringify(activeTimers))
    }
  }
}