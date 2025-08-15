import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const defaultCategories = [
  // Income categories
  { name: 'Salary', type: 'INCOME' as const, color: '#10b981', icon: 'briefcase' },
  { name: 'Freelance', type: 'INCOME' as const, color: '#3b82f6', icon: 'laptop' },
  { name: 'Investment', type: 'INCOME' as const, color: '#8b5cf6', icon: 'trending-up' },
  { name: 'Other Income', type: 'INCOME' as const, color: '#6366f1', icon: 'plus-circle' },
  
  // Expense categories
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

export async function GET(request: NextRequest) {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    // If no categories exist, create default ones
    if (categories.length === 0) {
      for (const categoryData of defaultCategories) {
        await db.category.create({
          data: categoryData
        })
      }
      
      const newCategories = await db.category.findMany({
        orderBy: {
          name: 'asc'
        }
      })
      
      return NextResponse.json(newCategories)
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, color, icon, description } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    const category = await db.category.create({
      data: {
        name,
        type,
        color,
        icon,
        description
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}