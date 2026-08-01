import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Liên hệ</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, hãy liên hệ với chúng tôi.
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Gửi tin nhắn</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input id="name" placeholder="Nhập họ và tên của bạn" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" placeholder="0912 345 678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Chủ đề</Label>
                    <Input id="subject" placeholder="Nhập chủ đề" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Nội dung</Label>
                    <Textarea id="message" placeholder="Nhập nội dung tin nhắn..." rows={5} />
                  </div>
                  <Button className="w-full">Gửi tin nhắn</Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Địa chỉ</h3>
                      <p className="text-muted-foreground">
                        123 Đường ABC, Quận 1, TP.HCM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Điện thoại</h3>
                      <p className="text-muted-foreground">0912 345 678</p>
                      <p className="text-muted-foreground">0987 654 321</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">contact@websale.com</p>
                      <p className="text-muted-foreground">support@websale.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Giờ làm việc</h3>
                  <div className="space-y-1 text-muted-foreground">
                    <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                    <p>Thứ 7: 9:00 - 16:00</p>
                    <p>Chủ nhật: Nghỉ</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
