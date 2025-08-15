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
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { ClientAPI } from '@/lib/client-api'

interface SavingsGoalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  goal?: any // For editing existing goal
}

export default function SavingsGoalForm({ open, onOpenChange, onSuccess, goal }: SavingsGoalFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    description: '',
    status: 'ACTIVE' as 'ACTIVE' | 'COMPLETED' | 'PAUSED'
  })
  const [loading, setLoading] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  useEffect(() => {
    if (open) {
      if (goal) {
        // Edit mode - populate form with existing goal data
        setFormData({
          name: goal.name,
          targetAmount: goal.targetAmount.toString(),
          currentAmount: goal.currentAmount.toString(),
          targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '',
          description: goal.description || '',
          status: goal.status
        })
      } else {
        // Create mode - reset form
        setFormData({
          name: '',
          targetAmount: '',
          currentAmount: '',
          targetDate: '',
          description: '',
          status: 'ACTIVE'
        })
      }
    }
  }, [open, goal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const goalData = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || '0'),
        targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : undefined,
        description: formData.description,
        status: formData.status
      }

      if (goal) {
        await ClientAPI.updateSavingsGoal(goal.id, goalData)
      } else {
        await ClientAPI.createSavingsGoal(goalData)
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error saving savings goal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Savings Goal' : 'Create Savings Goal'}</DialogTitle>
          <DialogDescription>
            {goal ? 'Update your savings goal.' : 'Set a new savings goal to track your progress.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentAmount">Current Amount</Label>
              <Input
                id="currentAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date (Optional)</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'ACTIVE' | 'COMPLETED' | 'PAUSED') => {
                setFormData(prev => ({ ...prev, status: value }))
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about your savings goal..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (goal ? 'Update Goal' : 'Create Goal')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}