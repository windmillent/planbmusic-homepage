import { useState, useRef, useEffect } from 'react';
import { Music, Globe, TrendingUp, Shield, Award, DollarSign } from 'lucide-react';
import { AnimatedGradientHeader } from './AnimatedGradientHeader';
import platformLogos from 'figma:asset/663e557c1d4550cf906ea0a21e5f45388847c7fb.png';
import { ServicesSection } from './ServicesSection';

interface DistributionPageProps {
  onNavigate?: (page: 'contact') => void;
}

export function DistributionPage({ onNavigate }: DistributionPageProps = {}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  const services = [
    {
      title: '간편하고 신속한 음원발매',
      description: '세계 각국의 레이블과 아티스트들이 전세계로 음악을 유통하고 퍼블리싱 할 수 있는 최적의 유통 매니지먼트를 선사합니다. 국내는 물론 해외 글로벌 플랫폼까지 권리자의 곡을 전 세계에 알립니다.',
    },
    {
      title: '합리적인 수수료',
      description: '합리적인 수수료를 제시함으로서 급격하게 변화하는 음원시장에서 가장 빠르게 대응하며 창작자들의 비전을 완성시켜드립니다.',
    },
    {
      title: '투명하고 확실한 데이터 제공',
      description: '고객들이 가장 원하는 데이터와 지표를 제공합니다. 음원시장에 전략적으로 접근이 가능할 수 있도록 투명하고 확실한 데이터를 제공합니다.',
    },
    {
      title: '음악 컨텐츠 투자/제작',
      description: '신인/기성 아티스트 및 기획사 등 다양한 장르의 음악에 투자, 제작으로 음원 시장 선순환 구조에 앞장서며, 지속적인 투자, 제작을 통해 동반 성장의 기반을 확보합니다.',
    },
    {
      title: 'SNS활용 및 타켓형 마케팅',
      description: 'Youtube 채널을 통해 수익을 높이고 여러 SNS를 통해 실청취로 유입하는 바이럴 마케팅을 진행합니다.',
    },
  ];

  // Auto-scroll effect
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollInterval.current = setInterval(() => {
        setActiveIndex((prev) => {
          const next = (prev + 1) % 4; // 0-3까지만 순환 (4개 그룹)
          scrollToIndex(next);
          return next;
        });
      }, 6000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = 424; // 400px width + 24px gap
    container.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 400;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header Section with Headline */}
      <AnimatedGradientHeader 
        title="Distribution" 
        subtitle="국내외 주요 플랫폼 네트워크를 통해 당신의 음악을 전 세계 리스너에게 가장 빠르고 정확하게 송출합니다."
      />

      {/* Partners Section with Platform Logos */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 font-black mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              전 세계 음악 플랫폼으로 당신의 음악을 전달합니다
            </h2>
            <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.2rem)' }}>
              플랜비뮤직은 아티스트의 음악을 Spotify, Apple Music, YouTube Music, Melon, Genie 등 전 세계 주요 음악 스트리밍 플랫폼에 배급합니다. 복잡한 절차 없이 간편하게 당신의 음악을 전 세계 리스너들에게 선보이세요.
            </p>
          </div>

          {/* Platform Logos Container */}
          <div className="max-w-6xl mx-auto bg-gray-50 rounded-3xl p-8 lg:p-12 border border-gray-200">
            <img 
              src={platformLogos} 
              alt="Distribution Partners" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Services Carousel Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-white/80 text-sm mb-2 tracking-widest">SERVICES</p>
            <h2 className="text-white font-black" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              WHAT WE DO?
            </h2>
          </div>

          {/* Scrollable Cards Container */}
          <div className="relative max-w-7xl mx-auto">
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[350px] lg:w-[400px] h-[280px] p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white hover:border-white transition-all duration-300 group snap-center cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-600 flex items-center justify-center transition-all">
                      <span className="text-white group-hover:text-white font-black text-lg">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-white group-hover:text-gray-900 font-black transition-colors flex-1" style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)' }}>
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-white/70 group-hover:text-gray-700 transition-colors leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1rem)' }}>
                    {service.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2, 3].map((dotIndex) => (
                <button
                  key={dotIndex}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === dotIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/80'
                  }`}
                  onClick={() => {
                    setActiveIndex(dotIndex);
                    scrollToIndex(dotIndex);
                    // Reset auto-scroll timer
                    if (autoScrollInterval.current) {
                      clearInterval(autoScrollInterval.current);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Previous sections remain below */}
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Process */}
          <section className="mb-20">
            <h2 className="font-black mb-10" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
              배급 프로세스
            </h2>
            
            <div className="space-y-6">
              {[
                { step: '1', title: '음원 제출', desc: '완성된 음원 파일과 앨범 정보를 제출합니다' },
                { step: '2', title: '검수 및 등록', desc: '음질 및 메타데이터 검수 후 플랫폼에 등록합니다' },
                { step: '3', title: '배급 완료', desc: '전 세계 음악 플랫폼에서 음원이 서비스됩니다' },
                { step: '4', title: '정산 및 리포트', desc: '월별 스트리밍 리포트 및 수익 정산을 제공합니다' },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl font-black">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-black mb-2" style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)' }}>
                      {item.title}
                    </h3>
                    <p className="text-gray-700" style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', lineHeight: '1.7' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-16 px-8 rounded-3xl bg-gradient-to-r from-cyan-400 to-purple-600">
            <h2 className="font-black text-white mb-6" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
              지금 바로 시작하세요
            </h2>
            <p className="text-white mb-8 opacity-90" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.1rem)', lineHeight: '1.8' }}>
              플랜비뮤직과 함께 당신의 음악을 전 세계에 알려보세요
            </p>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="px-10 py-4 bg-white text-gray-900 rounded-full font-black hover:bg-gray-100 transition-colors" 
              style={{ fontSize: 'clamp(1rem, 1.2vw, 1.1rem)' }}
            >
              문의하기
            </button>
          </section>
        </div>
      </div>

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
}