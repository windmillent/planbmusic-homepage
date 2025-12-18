import { useState } from 'react';
import { Send, Mail, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { AnimatedGradientHeader } from './AnimatedGradientHeader';
import { ServicesSection } from './ServicesSection';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

  // 전화번호 자동 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const phoneNumber = value.replace(/[^\d]/g, '');
    
    // 11자리 제한
    const limitedNumber = phoneNumber.slice(0, 11);
    
    // 포맷팅 (010-1234-5678)
    if (limitedNumber.length < 4) {
      return limitedNumber;
    } else if (limitedNumber.length < 8) {
      return `${limitedNumber.slice(0, 3)}-${limitedNumber.slice(3)}`;
    } else {
      return `${limitedNumber.slice(0, 3)}-${limitedNumber.slice(3, 7)}-${limitedNumber.slice(7)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formattedPhone });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/contact-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('문의가 성공적으로 전송되었습니다!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error('문의 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('문의 전송 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Contact Form Section - Full Gradient Background */}
      <section className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 py-16 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-white text-center font-black mb-4" style={{ 
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            letterSpacing: '-0.02em'
          }}>CONTACT</h1>
          <div className="text-center mb-12">
            <p className="text-white/90 mb-2" style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              fontWeight: '500'
            }}>💌 Start Your Plan</p>
            <p className="text-white/80" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.1rem)' }}>
              새로운 파트너십의 시작, 세상으로 나아갈 당신의 음악을 위한 제안을 기다립니다.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left - Form Fields */}
            <div className="space-y-4">
              <Input
                placeholder="Your Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/20 backdrop-blur-md border-white/30 border-2 h-14 text-white placeholder:text-white/70 rounded-xl focus-visible:ring-white/50"
                required
              />
              <Input
                type="email"
                placeholder="Your Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/20 backdrop-blur-md border-white/30 border-2 h-14 text-white placeholder:text-white/70 rounded-xl focus-visible:ring-white/50"
                required
              />
              <Input
                type="tel"
                placeholder="Your Phone *"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="bg-white/20 backdrop-blur-md border-white/30 border-2 h-14 text-white placeholder:text-white/70 rounded-xl focus-visible:ring-white/50"
                required
              />
              <Input
                placeholder="Message Subject *"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="bg-white/20 backdrop-blur-md border-white/30 border-2 h-14 text-white placeholder:text-white/70 rounded-xl focus-visible:ring-white/50"
                required
              />
            </div>

            {/* Right - Message Area */}
            <div className="space-y-4">
              <div className="bg-white/20 backdrop-blur-md border-white/30 border-2 rounded-xl p-6 h-[calc(100%-4rem)]">
                <p className="text-white font-medium mb-2">💌 메시지 내용을 입력해주세요.</p>
                <p className="text-white/70 text-sm mb-4">
                  첨부파일이 필요한 경우 <a href="mailto:planbmusic@naver.com" className="underline hover:text-white">planbmusic@naver.com</a> 메일로 문의 바랍니다.
                </p>
                <Textarea
                  placeholder="메시지를 입력하세요..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="border-0 bg-transparent resize-none focus-visible:ring-0 min-h-[180px] text-white placeholder:text-white/60"
                  required
                />
              </div>
              <Button 
                onClick={handleSubmit}
                className="w-full h-14 bg-white hover:bg-white/90 text-purple-600 border-0 rounded-xl font-semibold text-lg"
                size="lg"
                disabled={submitting}
              >
                <Send className="mr-2 h-5 w-5" />
                {submitting ? 'SENDING...' : 'SEND MESSAGE'}
              </Button>
            </div>
          </div>

          {/* Info Cards - Centered at Bottom */}
          <div className="max-w-3xl mx-auto mt-12 flex flex-col items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md border-white/30 border-2 rounded-full px-6 py-3 inline-flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white text-sm">접수된 문의는 관리자가 확인 후 빠른 시일 내에 답변드립니다.</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md border-white/30 border-2 rounded-full px-6 py-3 inline-flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white text-sm">모든 필드는 필수 입력 사항입니다.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
}