"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, TrendingDown, DollarSign, PiggyBank, Target, Edit, Trash2, BarChart3, PieChart } from 'lucide-react'
import TransactionForm from '@/components/transaction-form'
import BudgetForm from '@/components/budget-form'
import SavingsGoalForm from '@/components/savings-goal-form'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie, Legend } from 'recharts'

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  type: 'INCOME' | 'EXPENSE'
  category?: {
    name: string
    color?: string
  }
}

interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  period: string
}

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  status: string
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [showSavingsGoalForm, setShowSavingsGoalForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState<any>(null)
  const [editingSavingsGoal, setEditingSavingsGoal] = useState<any>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [transactionsRes, budgetsRes, savingsRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/budgets'),
        fetch('/api/savings-goals')
      ])

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData.slice(0, 5)) // Show only 5 recent transactions
      }

      if (budgetsRes.ok) {
        const budgetsData = await budgetsRes.json()
        setBudgets(budgetsData.slice(0, 3)) // Show only 3 budgets
      }

      if (savingsRes.ok) {
        const savingsData = await savingsRes.json()
        setSavingsGoals(savingsData.slice(0, 3)) // Show only 3 savings goals
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionSuccess = () => {
    fetchDashboardData()
  }

  const handleBudgetSuccess = () => {
    fetchDashboardData()
    setEditingBudget(null)
  }

  const handleSavingsGoalSuccess = () => {
    fetchDashboardData()
    setEditingSavingsGoal(null)
  }

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setShowBudgetForm(true)
  }

  const handleEditSavingsGoal = (goal: SavingsGoal) => {
    setEditingSavingsGoal(goal)
    setShowSavingsGoalForm(true)
  }

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) {
      return
    }

    try {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDashboardData()
      } else {
        console.error('Error deleting budget')
      }
    } catch (error) {
      console.error('Error deleting budget:', error)
    }
  }

  const handleDeleteSavingsGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this savings goal?')) {
      return
    }

    try {
      const response = await fetch(`/api/savings-goals/${goalId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDashboardData()
      } else {
        console.error('Error deleting savings goal')
      }
    } catch (error) {
      console.error('Error deleting savings goal:', error)
    }
  }

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getExpenseByCategoryData = () => {
    const expenses = transactions.filter(t => t.type === 'EXPENSE')
    const categoryTotals: { [key: string]: number } = {}

    expenses.forEach(transaction => {
      const categoryName = transaction.category?.name || 'Uncategorized'
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + transaction.amount
    })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10) // Top 10 categories
  }

  const getMonthlyTrendData = () => {
    const expenses = transactions.filter(t => t.type === 'EXPENSE')
    const monthlyTotals: { [key: string]: number } = {}

    expenses.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + transaction.amount
    })

    return Object.entries(monthlyTotals)
      .map(([month, amount]) => ({
        month: new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12) // Last 12 months
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold">SimpleAccounting</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowTransactionForm(true)} className="hidden sm:flex">
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowTransactionForm(true)}
                className="sm:hidden"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your income, expenses, and financial goals
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {savingsGoals.filter(g => g.status === 'ACTIVE').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="savings">Savings Goals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest income and expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No transactions yet. Add your first transaction to get started.
                    </p>
                  ) : (
                    transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'INCOME' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description || 'No description'}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{formatDate(transaction.date)}</span>
                              {transaction.category && (
                                <Badge variant="secondary" style={{ 
                                  backgroundColor: transaction.category.color ? `${transaction.category.color}20` : undefined,
                                  color: transaction.category.color || undefined
                                }}>
                                  {transaction.category.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`text-right font-medium ${
                          transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">Budgets</h2>
              <Button onClick={() => setShowBudgetForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Budget
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {budgets.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <PiggyBank className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      No budgets yet. Create your first budget to start tracking your spending.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                budgets.map((budget) => {
                  const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0
                  const isOverBudget = percentage > 100

                  return (
                    <Card key={budget.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{budget.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                              {budget.period}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditBudget(budget)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteBudget(budget.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Spent: {formatCurrency(budget.spent)}</span>
                            <span>Budget: {formatCurrency(budget.amount)}</span>
                          </div>
                          <Progress 
                            value={Math.min(percentage, 100)} 
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}% used
                            {isOverBudget && (
                              <span className="text-red-600 ml-2">
                                (Over budget by {formatCurrency(budget.spent - budget.amount)})
                              </span>
                            )}
                          </p>
                          
                          {budget.categories && budget.categories.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-sm font-medium">Category Breakdown:</p>
                              {budget.categories.map((bc: any) => (
                                <div key={bc.id} className="flex justify-between text-xs text-muted-foreground">
                                  <span>{bc.category?.name || 'Unknown'}</span>
                                  <span>{formatCurrency(bc.spent)} / {formatCurrency(bc.amount)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">Savings Goals</h2>
              <Button onClick={() => setShowSavingsGoalForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Goal
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {savingsGoals.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      No savings goals yet. Set your first savings goal to start building your wealth.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                savingsGoals.map((goal) => {
                  const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
                  const isCompleted = goal.status === 'COMPLETED'

                  return (
                    <Card key={goal.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{goal.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={isCompleted ? "default" : "secondary"}>
                              {goal.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSavingsGoal(goal)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSavingsGoal(goal.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Saved: {formatCurrency(goal.currentAmount)}</span>
                            <span>Goal: {formatCurrency(goal.targetAmount)}</span>
                          </div>
                          <Progress 
                            value={Math.min(percentage, 100)} 
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}% completed
                            {goal.targetDate && (
                              <span className="ml-2">
                                • Target: {new Date(goal.targetDate).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                          
                          {goal.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {goal.description}
                            </p>
                          )}
                          
                          {!isCompleted && goal.currentAmount >= goal.targetAmount && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                              🎉 Congratulations! You've reached your savings goal!
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">Expense Analytics</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Expense by Category Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Expenses by Category
                  </CardTitle>
                  <CardDescription>
                    See how much you're spending in each category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      amount: {
                        label: "Amount",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getExpenseByCategoryData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="category" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Expense Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Expense Distribution
                  </CardTitle>
                  <CardDescription>
                    Visual breakdown of your spending categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={getExpenseByCategoryData().reduce((acc, item, index) => {
                      acc[item.category] = {
                        label: item.category,
                        color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                      }
                      return acc
                    }, {} as any)}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={getExpenseByCategoryData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="amount"
                        >
                          {getExpenseByCategoryData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${(index * 137.5) % 360}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expense Trend</CardTitle>
                <CardDescription>
                  Track your spending patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    amount: {
                      label: "Amount",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getMonthlyTrendData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <TransactionForm 
        open={showTransactionForm}
        onOpenChange={setShowTransactionForm}
        onSuccess={handleTransactionSuccess}
      />

      <BudgetForm 
        open={showBudgetForm}
        onOpenChange={(open) => {
          setShowBudgetForm(open)
          if (!open) setEditingBudget(null)
        }}
        onSuccess={handleBudgetSuccess}
        budget={editingBudget}
      />

      <SavingsGoalForm 
        open={showSavingsGoalForm}
        onOpenChange={(open) => {
          setShowSavingsGoalForm(open)
          if (!open) setEditingSavingsGoal(null)
        }}
        onSuccess={handleSavingsGoalSuccess}
        goal={editingSavingsGoal}
      />
    </div>
  )
}