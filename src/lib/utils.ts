import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, (match) => (match === 'Đ' ? 'D' : 'd'))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  return `INV-${timestamp}`
}

export function getOrderStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PACKING: 'Đang đóng gói',
    SHIPPING: 'Đang giao',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
  }
  return statusMap[status] || status
}

export function getOrderStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    PACKING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    SHIPPING: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}
