import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedGradientHeader } from './AnimatedGradientHeader';
import { ServicesSection } from './ServicesSection';

export function AboutPage() {
  const sections = [
    {
      number: '01',
      title: 'OUR MISSION',
      quote: '"음악의 가치는 발견될 때 완성됩니다."',
      content: `좋은 음악이 세상에 나오는 것만큼 중요한 것은, 그 음악이 '제대로' 들려지는 것입니다. 플랜비뮤직은 급변하는 디지털 음악 시장에서 아티스트와 기획사가 직면한 불확실성을 걷어내고, 전 세계 리스너에게 닿을 수 있는 가장 빠르고 투명한 루트를 설계합니다.

우리는 단순한 유통 대행을 넘어, 당신의 음악이 국경과 세대를 넘어 사랑받을 수 있도록 돕는 Global Music Business Partner입니다.`,
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y3Rpb24lMjBzdHVkaW98ZW58MXx8fHwxNzY1NjczNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageAlt: 'Music Production Studio',
    },
    {
      number: '02',
      title: 'OUR SCALE',
      quote: '"시간이 증명하는 명반들의 선택"',
      content: `플랜비뮤직은 현재 4,871개의 앨범과 30,735곡의 방대한 라이브러리를 관리하고 있습니다. (2025년 기준)

김종국, 신화, 양파 등 시대를 대표하는 아티스트의 히트곡부터 <왕이 된 남자>, <구가의 서>, <F4 스페셜 에디션> 등 대중의 사랑을 받은 OST 명작들까지. 수많은 명반들이 플랜비뮤직의 안정적인 시스템 안에서 지금 이 순간에도 새로운 가치를 창출하고 있습니다.`,
      imageUrl: 'https://images.unsplash.com/photo-1631692362908-7fcbc77c5104?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2NTY5NjU0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageAlt: 'Vinyl Records Collection',
    },
    {
      number: '03',
      title: 'OUR SOLUTION',
      quote: '"성공을 위한 전략적 솔루션"',
      content: `창작자의 권리를 최우선으로, 우리는 세 가지 약속을 지킵니다.

첫째, 투명한 데이터
막연한 기대가 아닌, 눈에 보이는 정확한 지표가 필요합니다. 우리는 고객이 시장에 전략적으로 접근할 수 있도록 투명하고 확실한 데이터와 정산 리포트를 제공합니다.

둘째, 합리적인 수수료
창작 활동의 지속성을 위해 가장 합리적인 수수료율을 제안합니다. 급격하게 변화하는 시장 속에서도 아티스트가 더 많은 수익을 가져갈 수 있는 구조를 만듭니다.

셋째, 마케팅과 투자
가능성 있는 음악에는 과감히 투자합니다. 단순 유통을 넘어 제작 투자 및 유튜브/SNS 타겟 마케팅을 통해 음원 시장의 선순환을 이끌고 성장을 가속화합니다.`,
      imageUrl: 'https://images.unsplash.com/photo-1720962158812-d16549f1e5a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NjU3Nzc3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageAlt: 'Music Analytics',
    },
    {
      number: '04',
      title: 'PROMISE',
      quote: '"당신의 음악, 그 다음을 준비합니다."',
      content: `우리의 이름이 'PlanB'인 이유는, 언제나 당신을 위한 최적의 대안과 다음 계획을 준비하고 있기 때문입니다. 새로운 클라이언트에게는 성공적인 데뷔를 위한 발판이, 기존의 명반들에게는 영원한 생명력을 불어넣는 엔진이 되겠습니다.

세상으로 나아갈 당신의 음악, 플랜비뮤직이 가장 확실한 계획이 되어드리겠습니다.`,
      imageUrl: 'https://images.unsplash.com/photo-1706990492420-f76fb1dabe9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMGNvbmNlcnQlMjBzdGFnZXxlbnwxfHx8fDE3NjU3Nzc3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageAlt: 'Concert Stage',
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header Section */}
      <AnimatedGradientHeader 
        title="About Us" 
        subtitle="플랜비뮤직은 음악의 가치를 전 세계에 전달하는 글로벌 뮤직 비즈니스 파트너입니다."
      />

      {/* Content Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-20">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <ImageWithFallback 
                      src={section.imageUrl}
                      alt={section.imageAlt}
                      className="w-full h-[400px] object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {section.number}. 
                        </span>
                        <span className="text-gray-900 ml-2">{section.title}</span>
                      </h2>
                    </div>
                    
                    <p className="text-xl font-medium text-gray-800 italic">
                      {section.quote}
                    </p>
                    
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Section */}
      <ServicesSection />
    </div>
  );
}