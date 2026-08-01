import Link from 'next/link'
import { ShoppingCart, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">WebSale</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Cửa hàng trực tuyến hàng đầu Việt Nam. Chúng tôi cung cấp các sản phẩm
              chất lượng với giá cả hợp lý.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-primary">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">
                  Danh mục
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Dịch vụ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">
                  123 Đường ABC, Quận 1, TP.HCM
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href="tel:0912345678" className="text-sm text-muted-foreground hover:text-primary">
                  0912 345 678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href="mailto:contact@websale.com" className="text-sm text-muted-foreground hover:text-primary">
                  contact@websale.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WebSale. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  )
}
