import { LocalDB } from './local-db'

// Client-side API functions that work directly with IndexedDB
export class ClientAPI {
  // Health check
  static async health() {
    try {
      await LocalDB.initializeDefaultData()
      const users = await LocalDB.getUsers()
      const categories = await LocalDB.getCategories()
      
      return {
        message: "Good!",
        database: "IndexedDB",
        usersCount: users.length,
        categoriesCount: categories.length,
        status: "offline-ready"
      }
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }

  // Categories
  static async getCategories() {
    try {
      await LocalDB.initializeDefaultData()
      
      let categories = await LocalDB.getCategories()

      // If no categories exist, create default ones
      if (categories.length === 0) {
        const defaultCategories = [
          { name: 'Salary', type: 'INCOME' as const, color: '#10b981', icon: 'briefcase' },
          { name: 'Freelance', type: 'INCOME' as const, color: '#3b82f6', icon: 'laptop' },
          { name: 'Investment', type: 'INCOME' as const, color: '#8b5cf6', icon: 'trending-up' },
          { name: 'Other Income', type: 'INCOME' as const, color: '#6366f1', icon: 'plus-circle' },
          
          { name: 'Food & Dining', type: 'EXPENSE' as const, color: '#ef4444', icon: 'utensils' },
          { name: 'Transportation', type: 'EXPENSE' as const, color: '#f97316', icon: 'car' },
          { name: 'Shopping', type: 'EXPENSE' as const, color: '#ec4899', icon: 'shopping-bag' },
          { name: 'Entertainment', type: 'EXPENSE' as const, color: '#8b5cf6', icon: 'film' },
          { name: 'Bills & Utilities', type: 'EXPENSE' as const, color: '#06b6d4', icon: 'home' },
          { name: 'Healthcare', type: 'EXPENSE' as const, color: '#14b8a6', icon: 'heart' },
          { name: 'Education', type: 'EXPENSE' as const, color: '#3b82f6', icon: 'book' },
          { name: 'Travel', type: 'EXPENSE' as const, color: '#10b981', icon: 'plane' },
          { name: 'Other Expenses', type: 'EXPENSE' as const, color: '#6b7280', icon: 'more-horizontal' }
        ]

        for (const categoryData of defaultCategories) {
          await LocalDB.createCategory({
            name: categoryData.name,
            type: categoryData.type,
            color: categoryData.color,
            icon: categoryData.icon,
          })
        }
        
        categories = await LocalDB.getCategories()
      }

      // Sort categories by name
      categories.sort((a, b) => a.name.localeCompare(b.name))

      return categories
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  static async createCategory(data: { name: string; type: string; color?: string; icon?: string; description?: string }) {
    try {
      const category = await LocalDB.createCategory(data)
      return category
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  // Transactions
  static async getTransactions(limit?: number) {
    try {
      await LocalDB.initializeDefaultData()
      
      let transactions = await LocalDB.getTransactions()
      
      // Sort by date descending
      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      // Apply limit if specified
      if (limit) {
        transactions = transactions.slice(0, limit)
      }
      
      // Include category data
      const transactionsWithCategory = []
      for (const transaction of transactions) {
        const transactionWithCategory = { ...transaction }
        
        if (transaction.categoryId) {
          const category = await LocalDB.getCategory(transaction.categoryId)
          if (category) {
            transactionWithCategory.category = {
              name: category.name,
              color: category.color || '#6b7280',
              icon: category.icon || '📝'
            }
          }
        }
        
        transactionsWithCategory.push(transactionWithCategory)
      }

      return transactionsWithCategory
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  }

  static async createTransaction(data: { amount: number; description?: string; type: string; categoryId?: string; date?: string }) {
    try {
      // Get default user
      const users = await LocalDB.getUsers()
      const userId = users.length > 0 ? users[0].id : 'default-user'

      const transaction = await LocalDB.createTransaction({
        amount: data.amount,
        description: data.description,
        type: data.type as any,
        categoryId: data.categoryId,
        date: data.date ? new Date(data.date) : new Date(),
        userId
      })
      
      // Include category data in response
      let categoryData = undefined
      if (transaction.categoryId) {
        const category = await LocalDB.getCategory(transaction.categoryId)
        if (category) {
          categoryData = {
            name: category.name,
            color: category.color || '#6b7280',
            icon: category.icon || '📝'
          }
        }
      }

      const transactionWithCategory = {
        ...transaction,
        category: categoryData
      }

      return transactionWithCategory
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw error
    }
  }

  // Budgets
  static async getBudgets(limit?: number) {
    try {
      await LocalDB.initializeDefaultData()
      
      let budgets = await LocalDB.getBudgets()
      
      // Sort by creation date descending
      budgets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      // Apply limit if specified
      if (limit) {
        budgets = budgets.slice(0, limit)
      }
      
      // Include category details
      const budgetsWithCategoryDetails = []
      for (const budget of budgets) {
        const budgetWithDetails = { ...budget }
        
        if (budget.categories) {
          const categoriesWithDetails = await Promise.all(
            budget.categories.map(async (budgetCategory) => {
              const category = await LocalDB.getCategory(budgetCategory.categoryId)
              return {
                ...budgetCategory,
                category: category ? {
                  name: category.name,
                  color: category.color || '#6b7280',
                  icon: category.icon || '📝'
                } : undefined
              }
            })
          )
          budgetWithDetails.categories = categoriesWithDetails
        }
        
        budgetsWithCategoryDetails.push(budgetWithDetails)
      }

      return budgetsWithCategoryDetails
    } catch (error) {
      console.error('Error fetching budgets:', error)
      throw error
    }
  }

  static async createBudget(data: { name: string; amount: number; period: string; startDate: string; endDate: string; categories?: any[] }) {
    try {
      // Get default user
      const users = await LocalDB.getUsers()
      const userId = users.length > 0 ? users[0].id : 'default-user'

      // Prepare budget categories
      const budgetCategories = data.categories ? 
        data.categories.map((cat: any) => ({
          categoryId: cat.categoryId,
          amount: parseFloat(cat.amount),
          spent: 0
        })) : undefined

      const budget = await LocalDB.createBudget({
        name: data.name,
        amount: parseFloat(data.amount),
        spent: 0,
        period: data.period as any,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        userId,
        categories: budgetCategories
      })
      
      // Include category details in response
      const budgetWithDetails = { ...budget }
      
      if (budget.categories) {
        const categoriesWithDetails = await Promise.all(
          budget.categories.map(async (budgetCategory) => {
            const category = await LocalDB.getCategory(budgetCategory.categoryId)
            return {
              ...budgetCategory,
              category: category ? {
                name: category.name,
                color: category.color || '#6b7280',
                icon: category.icon || '📝'
              } : undefined
            }
          })
        )
        budgetWithDetails.categories = categoriesWithDetails
      }

      return budgetWithDetails
    } catch (error) {
      console.error('Error creating budget:', error)
      throw error
    }
  }

  static async getBudget(id: string) {
    try {
      await LocalDB.initializeDefaultData()
      
      const budget = await LocalDB.getBudget(id)

      if (!budget) {
        throw new Error('Budget not found')
      }
      
      // Include category details
      const budgetWithDetails = { ...budget }
      
      if (budget.categories) {
        const categoriesWithDetails = await Promise.all(
          budget.categories.map(async (budgetCategory) => {
            const category = await LocalDB.getCategory(budgetCategory.categoryId)
            return {
              ...budgetCategory,
              category: category ? {
                name: category.name,
                color: category.color || '#6b7280',
                icon: category.icon || '📝'
              } : undefined
            }
          })
        )
        budgetWithDetails.categories = categoriesWithDetails
      }

      return budgetWithDetails
    } catch (error) {
      console.error('Error fetching budget:', error)
      throw error
    }
  }

  static async updateBudget(id: string, data: { name: string; amount: number; period: string; startDate: string; endDate: string; categories?: any[] }) {
    try {
      // Delete existing budget categories
      const existingBudgetCategories = await LocalDB.getBudgetCategoriesByBudget(id)
      for (const category of existingBudgetCategories) {
        await LocalDB.deleteBudgetCategory(category.id)
      }

      // Update budget
      const budget = await LocalDB.updateBudget(id, {
        name: data.name,
        amount: parseFloat(data.amount),
        period: data.period as any,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      })
      
      if (!budget) {
        throw new Error('Budget not found')
      }
      
      // Create new budget categories if provided
      if (data.categories) {
        for (const cat of data.categories) {
          await LocalDB.createBudgetCategory({
            budgetId: id,
            categoryId: cat.categoryId,
            amount: parseFloat(cat.amount),
            spent: 0
          })
        }
      }
      
      // Get updated budget with categories
      const updatedBudget = await LocalDB.getBudget(id)
      
      // Include category details in response
      const budgetWithDetails = { ...updatedBudget! }
      
      if (updatedBudget?.categories) {
        const categoriesWithDetails = await Promise.all(
          updatedBudget.categories.map(async (budgetCategory) => {
            const category = await LocalDB.getCategory(budgetCategory.categoryId)
            return {
              ...budgetCategory,
              category: category ? {
                name: category.name,
                color: category.color || '#6b7280',
                icon: category.icon || '📝'
              } : undefined
            }
          })
        )
        budgetWithDetails.categories = categoriesWithDetails
      }

      return budgetWithDetails
    } catch (error) {
      console.error('Error updating budget:', error)
      throw error
    }
  }

  static async deleteBudget(id: string) {
    try {
      // Delete budget categories first
      const budgetCategories = await LocalDB.getBudgetCategoriesByBudget(id)
      for (const category of budgetCategories) {
        await LocalDB.deleteBudgetCategory(category.id)
      }

      // Delete the budget
      const success = await LocalDB.deleteBudget(id)
      
      if (!success) {
        throw new Error('Budget not found')
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting budget:', error)
      throw error
    }
  }

  // Savings Goals
  static async getSavingsGoals(limit?: number) {
    try {
      await LocalDB.initializeDefaultData()
      
      let savingsGoals = await LocalDB.getSavingsGoals()
      
      // Sort by creation date descending
      savingsGoals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      // Apply limit if specified
      if (limit) {
        savingsGoals = savingsGoals.slice(0, limit)
      }

      return savingsGoals
    } catch (error) {
      console.error('Error fetching savings goals:', error)
      throw error
    }
  }

  static async createSavingsGoal(data: { name: string; targetAmount: number; currentAmount?: number; targetDate?: string; description?: string }) {
    try {
      // Get default user
      const users = await LocalDB.getUsers()
      const userId = users.length > 0 ? users[0].id : 'default-user'

      const savingsGoal = await LocalDB.createSavingsGoal({
        name: data.name,
        targetAmount: parseFloat(data.targetAmount),
        currentAmount: data.currentAmount ? parseFloat(data.currentAmount) : 0,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        description: data.description,
        userId
      })

      return savingsGoal
    } catch (error) {
      console.error('Error creating savings goal:', error)
      throw error
    }
  }

  static async getSavingsGoal(id: string) {
    try {
      await LocalDB.initializeDefaultData()
      
      const savingsGoal = await LocalDB.getSavingsGoal(id)

      if (!savingsGoal) {
        throw new Error('Savings goal not found')
      }

      return savingsGoal
    } catch (error) {
      console.error('Error fetching savings goal:', error)
      throw error
    }
  }

  static async updateSavingsGoal(id: string, data: { name: string; targetAmount: number; currentAmount?: number; targetDate?: string; description?: string; status?: string }) {
    try {
      const savingsGoal = await LocalDB.updateSavingsGoal(id, {
        name: data.name,
        targetAmount: parseFloat(data.targetAmount),
        currentAmount: data.currentAmount ? parseFloat(data.currentAmount) : 0,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        description: data.description,
        status: data.status as any
      })

      if (!savingsGoal) {
        throw new Error('Savings goal not found')
      }

      return savingsGoal
    } catch (error) {
      console.error('Error updating savings goal:', error)
      throw error
    }
  }

  static async deleteSavingsGoal(id: string) {
    try {
      const success = await LocalDB.deleteSavingsGoal(id)
      
      if (!success) {
        throw new Error('Savings goal not found')
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting savings goal:', error)
      throw error
    }
  }
}