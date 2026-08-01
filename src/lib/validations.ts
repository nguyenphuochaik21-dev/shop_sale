import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
})

export const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự'),
  slug: z.string().min(2, 'Slug phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá phải lớn hơn 0'),
  comparePrice: z.number().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
  categoryId: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  slug: z.string().min(2, 'Slug phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
  parentId: z.string().optional(),
})

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Vui lòng nhập tên'),
  customerEmail: z.string().email('Email không hợp lệ'),
  customerPhone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  shippingAddress: z.string().min(10, 'Vui lòng nhập địa chỉ đầy đủ'),
  shippingCity: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  notes: z.string().optional(),
})

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập tên'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  address: z.string().min(10, 'Vui lòng nhập địa chỉ đầy đủ'),
  city: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().optional(),
  ward: z.string().optional(),
  isDefault: z.boolean().default(false),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type AddressInput = z.infer<typeof addressSchema>
