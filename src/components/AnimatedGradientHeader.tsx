interface AnimatedGradientHeaderProps {
  title: string;
  subtitle: string;
}

export function AnimatedGradientHeader({ title, subtitle }: AnimatedGradientHeaderProps) {
  return (
    <section className="relative overflow-hidden" style={{
      paddingTop: '4rem',
      paddingBottom: '4rem'
    }}>
      {/* Animated Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite'
        }}
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white font-black mb-4" style={{ 
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h1>
          <p className="text-white/90" style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            fontWeight: '500'
          }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </section>
  );
}
