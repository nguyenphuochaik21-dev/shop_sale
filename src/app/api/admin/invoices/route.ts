import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { issuedAt: 'desc' },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            customerName: true,
          },
        },
      },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json([], { status: 500 })
  }
}
