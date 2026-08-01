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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { productSchema, type ProductInput } from '@/lib/validations'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: string
  comparePrice: string | null
  sku: string | null
  stock: number
  categoryId: string | null
  isActive: boolean
  isFeatured: boolean
  images: string[]
}

interface ProductFormDialogProps {
  open: boolean
  onClose: () => void
  product: Product | null
}

export function ProductFormDialog({ open, onClose, product }: ProductFormDialogProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      isActive: true,
      isFeatured: false,
    },
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
        sku: product.sku || '',
        stock: product.stock,
        categoryId: product.categoryId || '',
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      })
      setImages(product.images || [])
    } else {
      reset({
        name: '',
        slug: '',
        description: '',
        price: 0,
        stock: 0,
        isActive: true,
        isFeatured: false,
      })
      setImages([])
    }
  }, [product, reset])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const { url } = await response.json()
          setImages((prev) => [...prev, url])
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lên hình ảnh',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProductInput) => {
    setIsSubmitting(true)

    try {
      const payload = {
        ...data,
        images,
        categoryId: data.categoryId || null,
      }

      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'

      const method = product ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: 'Thành công',
          description: product ? 'Sản phẩm đã được cập nhật' : 'Sản phẩm đã được tạo',
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Images */}
          <div className="space-y-2">
            <Label>Hình ảnh</Label>
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image src={image} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
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
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={4}
            />
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comparePrice">Giá gốc</Label>
              <Input
                id="comparePrice"
                type="number"
                {...register('comparePrice', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Số lượng *</Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Category & SKU */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Danh mục</Label>
              <Select
                value={watch('categoryId') || ''}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register('sku')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
