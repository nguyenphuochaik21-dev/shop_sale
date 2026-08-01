import { PrismaClient, Role, OrderStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
  })
  console.log('Created admin:', admin.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'dien-thoai' },
      update: {},
      create: {
        name: 'Điện thoại',
        slug: 'dien-thoai',
        description: 'Điện thoại thông minh các hãng',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'laptop' },
      update: {},
      create: {
        name: 'Laptop',
        slug: 'laptop',
        description: 'Laptop và máy tính xách tay',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tablet' },
      update: {},
      create: {
        name: 'Tablet',
        slug: 'tablet',
        description: 'Máy tính bảng',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'phu-kien' },
      update: {},
      create: {
        name: 'Phụ kiện',
        slug: 'phu-kien',
        description: 'Phụ kiện công nghệ',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
      },
    }),
  ])
  console.log('Created categories')

  // Get category IDs
  const [dienthoai, laptop, tablet, phukien] = categories

  // Create products
  const products = [
    // Điện thoại
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch. Thiết kế titanium cao cấp, khả năng chụp ảnh chuyên nghiệp.',
      price: 34990000,
      comparePrice: 37990000,
      sku: 'IP15PM256',
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
      ],
      categoryId: dienthoai.id,
      isFeatured: true,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Samsung Galaxy S24 Ultra với bút S Pen tích hợp, camera 200MP, màn hình Dynamic AMOLED 2X 6.8 inch. Chip Snapdragon 8 Gen 3 mạnh mẽ.',
      price: 28990000,
      comparePrice: 31990000,
      sku: 'SG24U512',
      stock: 45,
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop',
      ],
      categoryId: dienthoai.id,
      isFeatured: true,
    },
    {
      name: 'Xiaomi 14 Pro',
      slug: 'xiaomi-14-pro',
      description: 'Xiaomi 14 Pro với chip Snapdragon 8 Gen 3, camera Leica 50MP, sạc nhanh 120W. Màn hình AMOLED 6.73 inch 120Hz.',
      price: 16990000,
      comparePrice: 18990000,
      sku: 'XM14P256',
      stock: 60,
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
      ],
      categoryId: dienthoai.id,
    },
    // Laptop
    {
      name: 'MacBook Pro 14 inch M3 Pro',
      slug: 'macbook-pro-14-m3-pro',
      description: 'MacBook Pro 14 inch với chip M3 Pro, 18GB RAM, 512GB SSD. Màn hình Liquid Retina XDR, thời lượng pin lên đến 17 giờ.',
      price: 49990000,
      comparePrice: 54990000,
      sku: 'MBP14M3P',
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
      ],
      categoryId: laptop.id,
      isFeatured: true,
    },
    {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'Dell XPS 15 với Intel Core i9-13900H, 32GB RAM, 1TB SSD. Màn hình OLED 15.6 inch 3.5K, vô cùng mỏng nhẹ.',
      price: 45990000,
      comparePrice: 49990000,
      sku: 'DXPS15I9',
      stock: 20,
      images: [
        'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop',
      ],
      categoryId: laptop.id,
    },
    {
      name: 'ASUS ROG Zephyrus G14',
      slug: 'asus-rog-zephyrus-g14',
      description: 'Laptop gaming ASUS ROG Zephyrus G14 với AMD Ryzen 9, RTX 4070, 16GB RAM. Màn hình 14 inch 165Hz, RGB keyboard.',
      price: 38990000,
      comparePrice: 42990000,
      sku: 'ASROGG14',
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop',
      ],
      categoryId: laptop.id,
    },
    // Tablet
    {
      name: 'iPad Pro 12.9 inch M2',
      slug: 'ipad-pro-12-9-m2',
      description: 'iPad Pro 12.9 inch với chip M2, Liquid Retina XDR display, hỗ trợ Apple Pencil thế hệ 2. Kết nối Magic Keyboard.',
      price: 32990000,
      comparePrice: 35990000,
      sku: 'IPP12.9M2',
      stock: 35,
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
      ],
      categoryId: tablet.id,
      isFeatured: true,
    },
    {
      name: 'Samsung Galaxy Tab S9 Ultra',
      slug: 'samsung-galaxy-tab-s9-ultra',
      description: 'Samsung Galaxy Tab S9 Ultra với màn hình AMOLED 14.6 inch 120Hz, S Pen đi kèm, chip Snapdragon 8 Gen 2.',
      price: 26990000,
      comparePrice: 29990000,
      sku: 'SGTS9U256',
      stock: 28,
      images: [
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop',
      ],
      categoryId: tablet.id,
    },
    // Phụ kiện
    {
      name: 'AirPods Pro 2',
      slug: 'airpods-pro-2',
      description: 'AirPods Pro 2 với Active Noise Cancellation, Transparency Mode, Spatial Audio. Thời lượng pin 6 giờ, sạc MagSafe.',
      price: 6490000,
      comparePrice: 7490000,
      sku: 'APP2GEN',
      stock: 100,
      images: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=800&fit=crop',
      ],
      categoryId: phukien.id,
      isFeatured: true,
    },
    {
      name: 'Samsung Galaxy Watch 6',
      slug: 'samsung-galaxy-watch-6',
      description: 'Samsung Galaxy Watch 6 44mm với màn hình Super AMOLED, theo dõi sức khỏe toàn diện, GPS tích hợp.',
      price: 8990000,
      comparePrice: 9990000,
      sku: 'SGW644',
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop',
      ],
      categoryId: phukien.id,
    },
    {
      name: 'Bộ sạc nhanh 65W GaN',
      slug: 'bo-sac-nhanh-65w-gan',
      description: 'Bộ sạc nhanh 65W GaN với 2 cổng USB-C, 1 cổng USB-A. Tương thích với nhiều thiết bị, sạc nhanh PD 3.0.',
      price: 990000,
      comparePrice: 1290000,
      sku: 'charger65W',
      stock: 200,
      images: [
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop',
      ],
      categoryId: phukien.id,
    },
    {
      name: 'Tai nghe Sony WH-1000XM5',
      slug: 'tai-nghe-sony-wh-1000xm5',
      description: 'Tai nghe Sony WH-1000XM5 với Noise Cancellation hàng đầu, driver 30mm, thời lượng pin 30 giờ, LDAC audio.',
      price: 7990000,
      comparePrice: 8990000,
      sku: 'SYW1000XM5',
      stock: 40,
      images: [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop',
      ],
      categoryId: phukien.id,
      isFeatured: true,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log('Created products')

  // Create sample orders
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Nguyễn Văn A',
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 12),
      role: Role.USER,
    },
  })

  const orderProducts = await prisma.product.findMany({ take: 3 })
  if (orderProducts.length > 0) {
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId: user.id,
        status: OrderStatus.CONFIRMED,
        total: orderProducts[0].price * 1 + orderProducts[1].price * 2,
        shippingFee: 0,
        discount: 0,
        subtotal: orderProducts[0].price * 1 + orderProducts[1].price * 2,
        customerName: user.name || 'Nguyễn Văn A',
        customerEmail: user.email || 'user@example.com',
        customerPhone: '0912345678',
        shippingAddress: '123 Đường ABC, Quận 1',
        shippingCity: 'TP.HCM',
        items: {
          create: [
            {
              productId: orderProducts[0].id,
              productName: orderProducts[0].name,
              productImage: orderProducts[0].images[0],
              quantity: 1,
              price: orderProducts[0].price,
              total: orderProducts[0].price,
            },
            {
              productId: orderProducts[1].id,
              productName: orderProducts[1].name,
              productImage: orderProducts[1].images[0],
              quantity: 2,
              price: orderProducts[1].price,
              total: orderProducts[1].price * 2,
            },
          ],
        },
        statusHistory: {
          create: [
            { status: OrderStatus.PENDING, note: 'Đơn hàng được tạo' },
            { status: OrderStatus.CONFIRMED, note: 'Đã xác nhận thanh toán' },
          ],
        },
      },
    })
    console.log('Created sample order:', order.orderNumber)
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
