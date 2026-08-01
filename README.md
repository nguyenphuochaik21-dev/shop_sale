# Web Sale - E-commerce Platform

Một nền tảng thương mại điện tử hoàn chỉnh được xây dựng với Next.js 15, có thể deploy trực tiếp lên Vercel.

## Tính năng

### Authentication
- Đăng ký / Đăng nhập bằng email và mật khẩu
- Đăng nhập bằng Google
- Đăng nhập bằng Facebook
- Quên mật khẩu

### Người dùng
- Xem sản phẩm theo danh mục
- Tìm kiếm sản phẩm
- Bộ lọc sản phẩm (giá, danh mục)
- Giỏ hàng
- Thanh toán
- Theo dõi đơn hàng với timeline
- Lịch sử mua hàng

### Quản trị (Admin)
- Dashboard với biểu đồ doanh thu
- Quản lý sản phẩm (CRUD)
- Quản lý danh mục (CRUD)
- Quản lý đơn hàng
- Cập nhật trạng thái đơn hàng
- In hóa đơn
- Xuất báo cáo (Excel, PDF)
- Quản lý khách hàng
- Báo cáo doanh thu

### Các tính năng khác
- Dark mode
- Responsive design
- SEO friendly
- Chat đa nền tảng (Messenger, Zalo, Telegram, WhatsApp, Gmail, Gọi điện)
- Upload hình ảnh với Cloudinary

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (Radix UI)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Auth.js)
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Export:** ExcelJS, jsPDF
- **Deployment:** Vercel

## Yêu cầu

- Node.js 18.x hoặc cao hơn
- PostgreSQL database (Neon)
- Cloudinary account
- Google OAuth credentials
- Facebook OAuth credentials

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd web-sale
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Copy file `.env.example` và tạo `.env`:

```bash
cp .env.example .env
```

Cập nhật các giá trị trong `.env`:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host.database.neon.tech/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-characters"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Setup Database

```bash
# Tạo database schema
npx prisma db push

# Hoặc chạy migrations
npx prisma migrate dev

# Seed database (tùy chọn)
npm run db:seed
```

### 5. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Deploy lên Vercel

### Cách 1: Deploy tự động

1. Push code lên GitHub
2. Import project vào [Vercel](https://vercel.com)
3. Thêm các biến môi trường trong Vercel Dashboard
4. Deploy!

### Cách 2: Deploy thủ công

```bash
npm run build
```

Sau đó deploy thư mục `.next` lên Vercel.

## Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run start        # Chạy production server
npm run lint         # Kiểm tra lint
npm run db:push      # Push schema lên database
npm run db:migrate   # Chạy migrations
npm run db:seed      # Seed database
npm run db:studio    # Mở Prisma Studio
```

## Cấu trúc thư mục

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Seed data
├── src/
│   ├── actions/          # Server Actions
│   ├── app/              # Next.js App Router
│   │   ├── admin/        # Admin pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── products/     # Product pages
│   │   └── ...
│   ├── components/
│   │   ├── admin/        # Admin components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   └── lib/              # Utilities
├── .env.example          # Environment variables template
├── vercel.json          # Vercel config
└── package.json
```

## Tài khoản mặc định

Sau khi seed database:

- **Admin:** admin@example.com / admin123
- **User:** user@example.com / user123

## License

MIT License
