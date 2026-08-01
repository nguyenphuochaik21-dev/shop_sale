Bạn là một Senior Fullstack Engineer với 15 năm kinh nghiệm.

Mục tiêu của bạn là tạo một website thương mại điện tử cá nhân hoàn chỉnh có thể deploy trực tiếp lên Vercel mà KHÔNG cần chỉnh sửa thêm bất kỳ dòng code nào.

=====================================================

MỤC TIÊU QUAN TRỌNG NHẤT

Sau khi hoàn thành dự án, quy trình triển khai phải như sau:

1. git push lên GitHub
2. Import project vào Vercel
3. Thêm các biến môi trường
4. Nhấn Deploy
5. Website hoạt động ngay lập tức

Tuyệt đối không yêu cầu cấu hình thủ công sau khi deploy.

=====================================================

STACK CÔNG NGHỆ BẮT BUỘC

Framework:

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI

Backend:

- Next.js API Routes
- Server Actions

Database:

- Neon PostgreSQL
- Prisma ORM

Authentication:

- Auth.js (NextAuth)

Storage:

- Cloudinary

State:

- Zustand

Validation:

- Zod

Forms:

- React Hook Form

Export:

- ExcelJS
- jsPDF

Deploy:

- Vercel

=====================================================

YÊU CẦU TƯƠNG THÍCH VERCEL

Claude phải đảm bảo:

✓ Không sử dụng Express

✓ Không sử dụng server riêng

✓ Không dùng localhost cứng

✓ Không dùng file upload lưu vào ổ cứng

✓ Không dùng SQLite

✓ Không dùng session trên RAM

✓ Không dùng cron cục bộ

✓ Không dùng fs.writeFile()

✓ Không dùng thư viện không hỗ trợ serverless

✓ Không hard-code domain

✓ Tất cả API phải chạy trên Vercel Serverless Functions

=====================================================

ENVIRONMENT VARIABLES

Ứng dụng phải tự động đọc:

DATABASE_URL

NEXTAUTH_URL

NEXTAUTH_SECRET

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

FACEBOOK_CLIENT_ID

FACEBOOK_CLIENT_SECRET

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

Không được hard-code giá trị trong source code.

Ví dụ:

const db = process.env.DATABASE_URL;

=====================================================

CHỨC NĂNG

AUTHENTICATION

- Đăng ký
- Đăng nhập
- Đăng xuất
- Quên mật khẩu
- Google Login
- Facebook Login

ROLE

- User
- Admin

Middleware phải bảo vệ:

/admin/*

=====================================================

USER

- Xem sản phẩm
- Tìm kiếm
- Bộ lọc
- Giỏ hàng
- Thanh toán
- Lịch sử mua hàng
- Theo dõi đơn hàng

=====================================================

ORDER STATUS

- Chờ xác nhận
- Đã xác nhận
- Đang đóng gói
- Đang giao
- Hoàn thành
- Đã hủy

Timeline hiển thị:

Đặt hàng

↓

Xác nhận

↓

Đóng gói

↓

Đang giao

↓

Hoàn thành

=====================================================

CHAT ĐA NỀN TẢNG

Nút nổi góc phải:

- Messenger
- Facebook
- Zalo
- Telegram
- WhatsApp
- Gmail
- Gọi điện

Có animation.

=====================================================

ADMIN DASHBOARD

Hiển thị:

- Tổng doanh thu
- Tổng đơn hàng
- Tổng khách hàng
- Tổng sản phẩm
- Biểu đồ ngày
- Biểu đồ tháng
- Biểu đồ năm

=====================================================

QUẢN LÝ SẢN PHẨM

CRUD:

- Thêm
- Sửa
- Xóa

Upload:

- Cloudinary

=====================================================

QUẢN LÝ DANH MỤC

CRUD:

- Thêm
- Sửa
- Xóa

=====================================================

QUẢN LÝ ĐƠN HÀNG

- Xem đơn hàng
- Cập nhật trạng thái
- In hóa đơn
- Xuất Excel
- Xuất PDF

=====================================================

XUẤT BÁO CÁO

Theo:

- Ngày
- Tuần
- Tháng
- Năm

Export:

- Excel
- PDF

=====================================================

DATABASE

Tạo Prisma schema hoàn chỉnh:

User

Category

Product

Order

OrderItem

Invoice

Review

Cart

Address

=====================================================

PRISMA

Claude phải tạo:

prisma/schema.prisma

migration

seed.ts

script:

"db:push"

"db:migrate"

"db:seed"

=====================================================

BUILD SETTINGS

package.json phải có:

"build": "prisma generate && next build"

=====================================================

VERCEL SETTINGS

Claude phải tạo:

vercel.json

Nội dung:

{
  "framework": "nextjs"
}

=====================================================

README.md

README phải chứa:

npm install

npx prisma db push

npm run dev

npm run build

=====================================================

YÊU CẦU CODE

- TypeScript strict mode
- Không TODO
- Không mock data
- Không demo code
- Chuẩn production
- Responsive
- SEO
- Dark mode
- Skeleton loading

=====================================================

OUTPUT CUỐI

Claude phải tạo:

✓ toàn bộ source code

✓ toàn bộ API

✓ database schema

✓ middleware

✓ authentication

✓ admin dashboard

✓ hướng dẫn deploy Vercel

✓ file .env.example

✓ vercel.json

✓ README.md

Dự án phải chạy ngay khi:

1. Push GitHub
2. Import Vercel
3. Thêm ENV
4. Deploy