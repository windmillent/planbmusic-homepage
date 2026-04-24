import { motion } from 'motion/react';
import { useEffect } from 'react';
import gradientDots from 'figma:asset/3e8773a26a1c5d7aba8ce2793d7cca62bf591f3d.png';
import planbLogoWithSlogan from 'figma:asset/815b5738a398eb37b405fa2eb742e21129a3c7da.png';
import gradientBar from 'figma:asset/4eaa28092d1900da18dff5b5acdce29e60ca64ed.png';

export function HomePage() {
  // SEO: 홈페이지 메타 태그 설정
  useEffect(() => {
    document.title = 'PLANB MUSIC - 음악 배급 플랫폼 | 음원 유통 서비스';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '음원 발매부터 정산까지 창작자와 함께하는 전문 음악 배급 플랫폼. 국내외 주요 스트리밍 서비스 유통.');
    }
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section - Fixed height, no scroll */}
      <section className="h-[calc(100vh-5rem)] relative overflow-hidden bg-white flex flex-col">
        {/* Gradient Dots Circle Background - Right top corner with sweeping light */}
        <div className="absolute top-[-10%] right-[-5%] w-[75vw] h-[75vw] max-w-[900px] max-h-[900px] z-0">
          <motion.div
            className="w-full h-full relative"
            animate={{
              opacity: [0.35, 0.5, 0.4, 0.55, 0.35],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1]
            }}
          >
            <img 
              src={gradientDots}
              alt="" 
              className="w-full h-full object-contain"
            />
            {/* Sweeping light effect - like a spotlight passing through */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                width: '50%',
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1
              }}
            />
          </motion.div>
        </div>

        <div className="flex-1 container mx-auto px-8 lg:px-16 relative z-10 flex items-center">
          <div className="grid lg:grid-cols-2 gap-20 w-full items-center">
            {/* Left Content - PLANB Music Distribution */}
            <motion.div 
              className="space-y-3"
            >
              {/* PLANB Title - A and B are purple RGB(112,48,160) - Slide from left */}
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <h1 style={{ 
                  fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', 
                  lineHeight: '0.9', 
                  fontWeight: '900', 
                  letterSpacing: '-0.02em',
                  marginBottom: '0'
                }}>
                  <span className="text-black">PL</span>
                  <span style={{ color: 'rgb(112, 48, 160)' }}>A</span>
                  <span className="text-black">N</span>
                  <span style={{ color: 'rgb(112, 48, 160)' }}>B</span>
                </h1>
              </motion.div>

              {/* Music - Slide from left */}
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              >
                <h2 style={{ 
                  fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', 
                  lineHeight: '0.9', 
                  fontWeight: '900', 
                  letterSpacing: '-0.02em',
                  marginBottom: '0'
                }}>Music</h2>
              </motion.div>

              {/* Distribution - Slide from left */}
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                <h2 style={{ 
                  fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', 
                  lineHeight: '0.9', 
                  fontWeight: '900', 
                  letterSpacing: '-0.02em'
                }}>Distribution</h2>
              </motion.div>

              {/* Description Text - Fade from blur to sharp */}
              <motion.div 
                className="text-gray-800 pt-6"
                style={{ fontSize: 'clamp(0.85rem, 1.1vw, 1rem)', lineHeight: '1.7', fontFamily: 'Pretendard, -apple-system, sans-serif' }}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, delay: 0.9 }}
              >
                <p className="mb-1">플랜비뮤직은 국내를 넘어 전 세계 음악 시장에</p>
                <p className="mb-1">수많은 명곡들이 빛을 잃지 않도록,</p>
                <p>그리고 새로운 팬들과 만날 수 있도록 돕는 전문 음악 유통사입니다.</p>
              </motion.div>
            </motion.div>

            {/* Right Content - PLANB MUSIC Logo with Slogan */}
            <motion.div 
              className="relative flex items-center justify-end h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative z-10 w-full flex justify-end pr-0">
                {/* PLANB MUSIC Logo with Slogan Image - Fade in from bright light */}
                <motion.div
                  initial={{ 
                    opacity: 0,
                    filter: 'brightness(2.5) blur(15px)',
                  }}
                  animate={{ 
                    opacity: 1,
                    filter: 'brightness(1) blur(0px)',
                  }}
                  transition={{ 
                    duration: 1.8, 
                    delay: 0.5,
                    ease: "easeOut"
                  }}
                  className="w-[170%] max-w-[2200px]"
                  style={{ marginRight: '-10%' }}
                >
                  <img 
                    src={planbLogoWithSlogan}
                    alt="PLANB MUSIC" 
                    className="w-full h-auto"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Gradient Bar - Increased height for text visibility */}
        <div className="w-full h-[14vh] min-h-[95px] max-h-[120px]">
          <motion.div 
            className="h-full relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            {/* Animated gradient background image */}
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundImage: `url(${gradientBar})`,
                backgroundSize: '200% 100%',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            {/* Text overlay - smaller font for top text, bottom text slightly lifted */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6 sm:px-8 md:px-12 pb-3" style={{ fontFamily: 'Pretendard, -apple-system, sans-serif' }}>
              <p className="m-0 mb-3 text-center max-w-4xl" style={{ fontSize: 'clamp(0.7rem, 1.3vw, 0.95rem)', fontWeight: '400', letterSpacing: '0.01em', lineHeight: '1.6' }}>
                PlanB는 단순한 대안이 아닙니다. 음악이 가진 무한한 가능성을 현실로 만드는 가장 확실한 길입니다
              </p>
              <p className="m-0 text-center max-w-4xl" style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)', opacity: '0.95', lineHeight: '1.5' }}>
                주식회사 플랜비 뮤직 | 서울특별시 마포구 망원로 16, 202호 | planbmusic@naver.com
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
