import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()

    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    await prisma.order.update({
      where: { id: params.id },
      data: { status },
    })

    await prisma.orderStatusHistory.create({
      data: {
        orderId: params.id,
        status,
        note: `Cập nhật trạng thái: ${status}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
