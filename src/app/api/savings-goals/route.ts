import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    
    const savingsGoals = await db.savingsGoal.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(savingsGoals)
  } catch (error) {
    console.error('Error fetching savings goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch savings goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, targetAmount, currentAmount, targetDate, description } = body

    if (!name || !targetAmount) {
      return NextResponse.json(
        { error: 'Name and target amount are required' },
        { status: 400 }
      )
    }

    const savingsGoal = await db.savingsGoal.create({
      data: {
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        targetDate: targetDate ? new Date(targetDate) : null,
        description,
        userId: 'default-user' // In a real app, this would come from authentication
      }
    })

    return NextResponse.json(savingsGoal, { status: 201 })
  } catch (error) {
    console.error('Error creating savings goal:', error)
    return NextResponse.json(
      { error: 'Failed to create savings goal' },
      { status: 500 }
    )
  }
}