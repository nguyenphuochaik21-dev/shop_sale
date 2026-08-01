'use server'

import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { OrderStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createOrder(formData: FormData) {
  try {
    const customerName = formData.get('customerName') as string
    const customerEmail = formData.get('customerEmail') as string
    const customerPhone = formData.get('customerPhone') as string
    const shippingAddress = formData.get('shippingAddress') as string
    const shippingCity = formData.get('shippingCity') as string
    const notes = formData.get('notes') as string
    const itemsJson = formData.get('items') as string
    const subtotal = parseFloat(formData.get('subtotal') as string)
    const shippingFee = parseFloat(formData.get('shippingFee') as string) || 0
    const discount = parseFloat(formData.get('discount') as string) || 0

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !shippingCity) {
      return { error: 'Vui lòng điền đầy đủ thông tin' }
    }

    const items = JSON.parse(itemsJson)

    if (!items || items.length === 0) {
      return { error: 'Giỏ hàng trống' }
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        shippingCity,
        notes,
        subtotal,
        shippingFee,
        discount,
        total: subtotal + shippingFee - discount,
        status: OrderStatus.PENDING,
        statusHistory: {
          create: {
            status: OrderStatus.PENDING,
            note: 'Đơn hàng được tạo',
          },
        },
      },
    })

    await prisma.orderItem.createMany({
      data: items.map((item: Record<string, unknown>) => ({
        orderId: order.id,
        productId: item.productId as string,
        productName: item.name as string,
        productImage: item.image as string,
        quantity: item.quantity as number,
        price: item.price as number,
        total: (item.price as number) * (item.quantity as number),
      })),
    })

    revalidatePath('/orders')
    revalidatePath('/admin/orders')

    return { success: true, orderId: order.id, orderNumber: order.orderNumber }
  } catch (error) {
    console.error('Create order error:', error)
    return { error: 'Đã xảy ra lỗi khi tạo đơn hàng' }
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        note,
      },
    })

    revalidatePath('/admin/orders')
    revalidatePath('/orders')

    return { success: true }
  } catch (error) {
    console.error('Update order status error:', error)
    return { error: 'Đã xảy ra lỗi' }
  }
}

export async function getOrders(userId?: string) {
  try {
    const orders = await prisma.order.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return orders
  } catch (error) {
    console.error('Get orders error:', error)
    return []
  }
}

export async function getOrderById(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return order
  } catch (error) {
    console.error('Get order error:', error)
    return null
  }
}
