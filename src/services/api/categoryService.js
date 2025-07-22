import categoriesData from "@/services/mockData/categories.json"

let categories = [...categoriesData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const categoryService = {
  async getAll() {
    await delay()
    return [...categories].sort((a, b) => a.order - b.order)
  },

  async getById(id) {
    await delay()
    return categories.find(category => category.Id === parseInt(id))
  },

  async create(categoryData) {
    await delay()
    const newCategory = {
      ...categoryData,
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      order: categories.length + 1
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(id, updates) {
    await delay()
    const index = categories.findIndex(category => category.Id === parseInt(id))
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates }
      return { ...categories[index] }
    }
    return null
  },

  async delete(id) {
    await delay()
    const index = categories.findIndex(category => category.Id === parseInt(id))
    if (index !== -1) {
      const deleted = categories.splice(index, 1)[0]
      return { ...deleted }
    }
    return null
  }
}