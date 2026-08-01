import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
  file: File,
  folder: string = 'web-sale'
): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error)
            else if (result) resolve(result)
          }
        )
        .end(buffer)
    })

    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return null
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return false
  }
}

export function getPublicIdFromUrl(url: string): string {
  const parts = url.split('/')
  const fileName = parts[parts.length - 1]
  const publicId = fileName.split('.')[0]
  const folderIndex = parts.indexOf('web-sale')
  if (folderIndex !== -1) {
    return `web-sale/${publicId}`
  }
  return publicId
}
