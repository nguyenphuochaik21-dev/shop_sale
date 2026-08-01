'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations'
import { signIn } from 'next-auth/react'
import { Role } from '@prisma/client'

export async function registerUser(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const validation = registerSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { error: 'Email đã được sử dụng' }
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: Role.USER,
      },
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error('Register error:', error)
    return { error: 'Đã xảy ra lỗi khi đăng ký' }
  }
}

export async function loginUser(formData: FormData) {
  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const validation = loginSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      return { error: 'Email hoặc mật khẩu không đúng' }
    }

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Đã xảy ra lỗi khi đăng nhập' }
  }
}

export async function loginWithGoogle() {
  await signIn('google', { callbackUrl: '/' })
}

export async function loginWithFacebook() {
  await signIn('facebook', { callbackUrl: '/' })
}

export async function forgotPassword(formData: FormData) {
  try {
    const data = { email: formData.get('email') as string }

    const validation = forgotPasswordSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      return { success: true }
    }

    const resetToken = Math.random().toString(36).substring(2, 15)
    const resetTokenExpiry = new Date(Date.now() + 3600000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        accounts: {
          create: {
            type: 'reset',
            provider: 'email',
            providerAccountId: resetToken,
          },
        },
      },
    })

    return { success: true, message: 'Đã gửi email đặt lại mật khẩu' }
  } catch (error) {
    console.error('Forgot password error:', error)
    return { error: 'Đã xảy ra lỗi' }
  }
}

export async function resetPassword(token: string, formData: FormData) {
  try {
    const data = {
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const validation = resetPasswordSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    return { success: true }
  } catch (error) {
    console.error('Reset password error:', error)
    return { error: 'Đã xảy ra lỗi' }
  }
}
