import { Code, Smartphone, Cloud, Lightbulb, Shield, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function Services() {
  const services = [
    {
      icon: Code,
      title: '웹 개발',
      description: '최신 기술 스택을 활용한 확장 가능하고 안정적인 웹 애플리케이션 개발',
    },
    {
      icon: Smartphone,
      title: '모바일 앱 개발',
      description: 'iOS와 Android를 위한 네이티브 및 크로스 플랫폼 모바일 솔루션',
    },
    {
      icon: Cloud,
      title: '클라우드 솔루션',
      description: 'AWS, Azure, GCP를 활용한 클라우드 인프라 구축 및 마이그레이션',
    },
    {
      icon: Lightbulb,
      title: 'IT 컨설팅',
      description: '비즈니스 목표 달성을 위한 전략적 기술 컨설팅 서비스',
    },
    {
      icon: Shield,
      title: '보안 솔루션',
      description: '엔터프라이즈급 보안 시스템 구축 및 보안 취약점 분석',
    },
    {
      icon: BarChart,
      title: '데이터 분석',
      description: 'AI/ML 기반의 데이터 분석 및 비즈니스 인텔리전스 솔루션',
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">서비스</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            다양한 산업 분야의 고객을 위한 전문적인 기술 서비스를 제공합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
