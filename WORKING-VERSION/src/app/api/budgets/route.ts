import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    
    const budgets = await db.budget.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
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

    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, amount, period, startDate, endDate, categories } = body

    if (!name || !amount || !period || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Name, amount, period, start date, and end date are required' },
        { status: 400 }
      )
    }

    const budget = await db.budget.create({
      data: {
        name,
        amount: parseFloat(amount),
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: 'default-user', // In a real app, this would come from authentication
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

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    )
  }
}