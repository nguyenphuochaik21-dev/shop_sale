'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { categorySchema, type CategoryInput } from '@/lib/validations'
import { Loader2, Upload, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
}

interface CategoryFormDialogProps {
  open: boolean
  onClose: () => void
  category: Category | null
}

export function CategoryFormDialog({ open, onClose, category }: CategoryFormDialogProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
      })
      setImage(category.image)
    } else {
      reset({
        name: '',
        slug: '',
        description: '',
      })
      setImage(null)
    }
  }, [category, reset])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setImage(url)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lên hình ảnh',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: CategoryInput) => {
    setIsSubmitting(true)

    try {
      const payload = {
        ...data,
        image,
      }

      const url = category
        ? `/api/admin/categories/${category.id}`
        : '/api/admin/categories'

      const method = category ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: 'Thành công',
          description: category ? 'Danh mục đã được cập nhật' : 'Danh mục đã được tạo',
        })
        onClose()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image */}
          <div className="space-y-2">
            <Label>Hình ảnh</Label>
            <div className="flex items-center gap-4">
              {image ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên danh mục *</Label>
            <Input
              id="name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...register('slug')}
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {category ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
