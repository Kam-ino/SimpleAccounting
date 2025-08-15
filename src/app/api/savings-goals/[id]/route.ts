import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const savingsGoal = await db.savingsGoal.findUnique({
      where: { id: params.id }
    })

    if (!savingsGoal) {
      return NextResponse.json(
        { error: 'Savings goal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(savingsGoal)
  } catch (error) {
    console.error('Error fetching savings goal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch savings goal' },
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
    const { name, targetAmount, currentAmount, targetDate, description, status } = body

    if (!name || !targetAmount) {
      return NextResponse.json(
        { error: 'Name and target amount are required' },
        { status: 400 }
      )
    }

    const savingsGoal = await db.savingsGoal.update({
      where: { id: params.id },
      data: {
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        targetDate: targetDate ? new Date(targetDate) : null,
        description,
        status
      }
    })

    return NextResponse.json(savingsGoal)
  } catch (error) {
    console.error('Error updating savings goal:', error)
    return NextResponse.json(
      { error: 'Failed to update savings goal' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.savingsGoal.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting savings goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete savings goal' },
      { status: 500 }
    )
  }
}