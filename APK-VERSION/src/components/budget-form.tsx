"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { ClientAPI } from '@/lib/client-api'

interface Category {
  id: string
  name: string
  type: 'INCOME' | 'EXPENSE'
  color?: string
  icon?: string
}

interface BudgetCategory {
  categoryId: string
  amount: string
}

interface BudgetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  budget?: any // For editing existing budget
}

export default function BudgetForm({ open, onOpenChange, onSuccess, budget }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    period: 'MONTHLY' as 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [startCalendarOpen, setStartCalendarOpen] = useState(false)
  const [endCalendarOpen, setEndCalendarOpen] = useState(false)

  useEffect(() => {
    if (open) {
      fetchCategories()
      if (budget) {
        // Edit mode - populate form with existing budget data
        setFormData({
          name: budget.name,
          amount: budget.amount.toString(),
          period: budget.period,
          startDate: new Date(budget.startDate),
          endDate: new Date(budget.endDate)
        })
        setBudgetCategories(
          budget.categories.map((bc: any) => ({
            categoryId: bc.categoryId,
            amount: bc.amount.toString()
          }))
        )
      } else {
        // Create mode - reset form
        setFormData({
          name: '',
          amount: '',
          period: 'MONTHLY',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        })
        setBudgetCategories([])
      }
    }
  }, [open, budget])

  const fetchCategories = async () => {
    try {
      const data = await ClientAPI.getCategories()
      setCategories(data.filter((cat: Category) => cat.type === 'EXPENSE'))
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const addBudgetCategory = () => {
    setBudgetCategories([...budgetCategories, { categoryId: '', amount: '' }])
  }

  const removeBudgetCategory = (index: number) => {
    setBudgetCategories(budgetCategories.filter((_, i) => i !== index))
  }

  const updateBudgetCategory = (index: number, field: keyof BudgetCategory, value: string) => {
    const updated = [...budgetCategories]
    updated[index] = { ...updated[index], [field]: value }
    setBudgetCategories(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const budgetData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        period: formData.period,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        categories: budgetCategories.filter(bc => bc.categoryId && bc.amount).map(bc => ({
          categoryId: bc.categoryId,
          amount: parseFloat(bc.amount)
        }))
      }

      if (budget) {
        await ClientAPI.updateBudget(budget.id, budgetData)
      } else {
        await ClientAPI.createBudget(budgetData)
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error saving budget:', error)
    } finally {
      setLoading(false)
    }
  }

  const availableCategories = categories.filter(
    cat => !budgetCategories.some(bc => bc.categoryId === cat.id)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Create Budget'}</DialogTitle>
          <DialogDescription>
            {budget ? 'Update your budget settings.' : 'Create a new budget to track your spending.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Budget Name</Label>
              <Input
                id="name"
                placeholder="e.g., Monthly Budget"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select
              value={formData.period}
              onValueChange={(value: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
                setFormData(prev => ({ ...prev, period: value }))
                // Update end date based on period
                const startDate = formData.startDate
                let endDate = new Date(startDate)
                switch (value) {
                  case 'WEEKLY':
                    endDate.setDate(startDate.getDate() + 7)
                    break
                  case 'MONTHLY':
                    endDate.setMonth(startDate.getMonth() + 1)
                    break
                  case 'QUARTERLY':
                    endDate.setMonth(startDate.getMonth() + 3)
                    break
                  case 'YEARLY':
                    endDate.setFullYear(startDate.getFullYear() + 1)
                    break
                }
                setFormData(prev => ({ ...prev, endDate }))
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, startDate: date }))
                        setStartCalendarOpen(false)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, endDate: date }))
                        setEndCalendarOpen(false)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Category Allocations</Label>
              <Button type="button" variant="outline" size="sm" onClick={addBudgetCategory}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
            
            {budgetCategories.map((budgetCategory, index) => (
              <div key={index} className="grid grid-cols-[1fr,120px,40px] gap-2 items-end">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={budgetCategory.categoryId}
                    onValueChange={(value) => updateBudgetCategory(index, 'categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories
                        .concat(categories.find(cat => cat.id === budgetCategory.categoryId) || [])
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              {category.color && (
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                              )}
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={budgetCategory.amount}
                    onChange={(e) => updateBudgetCategory(index, 'amount', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeBudgetCategory(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (budget ? 'Update Budget' : 'Create Budget')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}