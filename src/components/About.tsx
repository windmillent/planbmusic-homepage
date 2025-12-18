import { Target, Users, Award, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  const stats = [
    { icon: Users, label: '글로벌 고객', value: '500+' },
    { icon: Award, label: '수상 경력', value: '50+' },
    { icon: TrendingUp, label: '성장률', value: '200%' },
    { icon: Target, label: '프로젝트 완료', value: '1000+' },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">회사 소개</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            2015년 설립된 TechCorp는 기술 혁신을 통해 세상을 변화시키는 것을 목표로 합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758518731706-be5d5230e5a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBwcm9mZXNzaW9uYWxzfGVufDF8fHx8MTc2NTQ2NzY5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="비즈니스 미팅"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="mb-4">우리의 비전</h3>
            <p className="text-gray-600 mb-6">
              TechCorp는 기술과 창의성을 결합하여 비즈니스의 디지털 전환을 선도합니다. 
              우리는 고객의 성공이 곧 우리의 성공이라는 신념으로, 최고 수준의 서비스와 솔루션을 제공합니다.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="text-gray-700">고객 중심의 맞춤형 솔루션 개발</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="text-gray-700">최신 기술 트렌드를 반영한 혁신적 접근</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="text-gray-700">지속적인 성장과 발전을 위한 파트너십</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
