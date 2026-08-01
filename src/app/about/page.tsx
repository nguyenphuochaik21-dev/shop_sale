import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Truck, CreditCard, Headphones } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <section className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Về WebSale</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi cung cấp các sản phẩm công nghệ chất lượng cao với giá cả hợp lý,
              mang đến trải nghiệm mua sắm tuyệt vời cho khách hàng.
            </p>
          </section>

          {/* Mission */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Sứ mệnh của chúng tôi</h2>
                <p className="text-muted-foreground mb-4">
                  WebSale được thành lập với mục tiêu mang đến cho khách hàng những sản phẩm
                  công nghệ chính hãng với giá thành hợp lý nhất. Chúng tôi cam kết:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Sản phẩm 100% chính hãng</li>
                  <li>Giá cả cạnh tranh nhất thị trường</li>
                  <li>Bảo hành chính hãng 12 tháng</li>
                  <li>Hỗ trợ khách hàng 24/7</li>
                  <li>Giao hàng nhanh chóng trên toàn quốc</li>
                </ul>
              </div>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Hình ảnh công ty</p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Tại sao chọn WebSale?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Sản phẩm chính hãng</h3>
                  <p className="text-sm text-muted-foreground">
                    100% sản phẩm được nhập khẩu chính hãng với chế độ bảo hành đầy đủ
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Giao hàng nhanh</h3>
                  <p className="text-sm text-muted-foreground">
                    Giao hàng trong 24-48h tại các thành phố lớn trên toàn quốc
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Thanh toán an toàn</h3>
                  <p className="text-sm text-muted-foreground">
                    Nhiều hình thức thanh toán: COD, chuyển khoản, thẻ tín dụng
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Hỗ trợ 24/7</h3>
                  <p className="text-sm text-muted-foreground">
                    Đội ngũ tư vấn luôn sẵn sàng hỗ trợ mọi lúc
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4">Liên hệ với chúng tôi</h2>
            <p className="text-muted-foreground mb-6">
              Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-left">
                <p className="font-medium">Địa chỉ:</p>
                <p className="text-muted-foreground">123 Đường ABC, Quận 1, TP.HCM</p>
              </div>
              <div className="text-left">
                <p className="font-medium">Điện thoại:</p>
                <p className="text-muted-foreground">0912 345 678</p>
              </div>
              <div className="text-left">
                <p className="font-medium">Email:</p>
                <p className="text-muted-foreground">contact@websale.com</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
