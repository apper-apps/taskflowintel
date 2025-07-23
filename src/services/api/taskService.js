import { toast } from "react-toastify";

export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "estimatedHours" } },
          { field: { Name: "timeTracking" } },
          { field: { Name: "completed" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "order" } },
          { field: { Name: "categoryId" } }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching tasks:", error.message);
        toast.error("Failed to fetch tasks");
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "estimatedHours" } },
          { field: { Name: "timeTracking" } },
          { field: { Name: "completed" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "order" } },
          { field: { Name: "categoryId" } }
        ]
      };

      const response = await apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching task:", response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching task:", error?.response?.data?.message);
      } else {
        console.error("Error fetching task:", error.message);
      }
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const createData = {
        title: taskData.title,
        description: taskData.description || "",
        priority: taskData.priority || "medium",
        dueDate: taskData.dueDate || null,
        estimatedHours: taskData.estimatedHours || null,
        timeTracking: taskData.timeTracking || null,
        completed: false,
        createdAt: new Date().toISOString(),
        order: taskData.order || 1,
        categoryId: taskData.categoryId ? parseInt(taskData.categoryId) : null
      };

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error("Error creating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} task records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Task created successfully!");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating task:", error.message);
        toast.error("Failed to create task");
      }
      return null;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const updateData = {
        Id: parseInt(id),
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.priority !== undefined && { priority: updates.priority }),
        ...(updates.dueDate !== undefined && { dueDate: updates.dueDate }),
        ...(updates.estimatedHours !== undefined && { estimatedHours: updates.estimatedHours }),
        ...(updates.timeTracking !== undefined && { timeTracking: updates.timeTracking }),
        ...(updates.completed !== undefined && { completed: updates.completed }),
        ...(updates.createdAt !== undefined && { createdAt: updates.createdAt }),
        ...(updates.order !== undefined && { order: updates.order }),
        ...(updates.categoryId !== undefined && { categoryId: updates.categoryId ? parseInt(updates.categoryId) : null })
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error("Error updating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} task records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating task:", error.message);
        toast.error("Failed to update task");
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error("Error deleting task:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} task records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Task deleted successfully!");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting task:", error.message);
        toast.error("Failed to delete task");
      }
      return false;
    }
  },

  async getByCategory(categoryId) {
    try {
      const allTasks = await this.getAll();
      return allTasks.filter(task => task.categoryId === parseInt(categoryId));
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      return [];
    }
  },

  async getCompleted() {
    try {
      const allTasks = await this.getAll();
      return allTasks.filter(task => task.completed);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      return [];
    }
  },

  async getTodayTasks() {
    try {
      const allTasks = await this.getAll();
      const today = new Date().toISOString().split("T")[0];
      return allTasks.filter(task => 
        !task.completed && 
        (task.dueDate === today || !task.dueDate)
      );
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      return [];
    }
  },

  async getUpcomingTasks() {
    try {
      const allTasks = await this.getAll();
      const today = new Date();
      return allTasks.filter(task => 
        !task.completed && 
        task.dueDate && 
        new Date(task.dueDate) > today
      );
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      return [];
    }
  },

  async toggleComplete(id) {
    try {
      const task = await this.getById(id);
      if (!task) return null;

      const updatedTask = await this.update(id, { 
        completed: !task.completed,
        // Stop timer when task is completed
        ...(task.completed === false && task.timeTracking?.isActive && {
          timeTracking: { ...task.timeTracking, isActive: false }
        })
      });

      if (updatedTask) {
        toast.success(
          updatedTask.completed ? "Task completed!" : "Task reopened!",
          { autoClose: 2000 }
        );
      }

      return updatedTask;
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to update task");
      return null;
    }
  },

  async toggleTimer(id) {
    try {
      const task = await this.getById(id);
      if (!task) return null;

      const now = new Date();
      let newTimeTracking = task.timeTracking || {
        isActive: false,
        totalHours: 0,
        sessions: []
      };

      if (newTimeTracking.isActive) {
        // Stop timer
        const activeSession = newTimeTracking.sessions.find(s => !s.endTime);
        if (activeSession) {
          activeSession.endTime = now.toISOString();
          const sessionHours = (now - new Date(activeSession.startTime)) / (1000 * 60 * 60);
          newTimeTracking.totalHours += sessionHours;
        }
        newTimeTracking.isActive = false;
      } else {
        // Start timer
        newTimeTracking.isActive = true;
        newTimeTracking.sessions.push({
          startTime: now.toISOString()
        });
      }

      const updatedTask = await this.update(id, { timeTracking: newTimeTracking });
      
      if (updatedTask) {
        const action = updatedTask.timeTracking?.isActive ? "started" : "stopped";
        toast.success(`Timer ${action} for "${updatedTask.title}"`);
      }

      return updatedTask;
    } catch (error) {
      console.error("Error toggling timer:", error);
      toast.error("Failed to toggle timer");
      return null;
    }
  }
};