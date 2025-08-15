import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const budget = await db.budget.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          include: {
            category: {
              select: {
                name: true,
                color: true,
                icon: true
              }
            }
          }
        }
      }
    })

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error fetching budget:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budget' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, amount, period, startDate, endDate, categories } = body

    if (!name || !amount || !period || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Name, amount, period, start date, and end date are required' },
        { status: 400 }
      )
    }

    // Delete existing budget categories
    await db.budgetCategory.deleteMany({
      where: { budgetId: params.id }
    })

    const budget = await db.budget.update({
      where: { id: params.id },
      data: {
        name,
        amount: parseFloat(amount),
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        categories: categories ? {
          create: categories.map((cat: any) => ({
            categoryId: cat.categoryId,
            amount: parseFloat(cat.amount)
          }))
        } : undefined
      },
      include: {
        categories: {
          include: {
            category: {
              select: {
                name: true,
                color: true,
                icon: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete budget categories first
    await db.budgetCategory.deleteMany({
      where: { budgetId: params.id }
    })

    // Delete the budget
    await db.budget.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    )
  }
}