import logoImage from 'figma:asset/6dccce9292d3f0db3e8fabffece2329841378d23.png';

export function LogoSection() {
  return (
    <section className="py-12 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <img 
          src={logoImage}
          alt="PLANB MUSIC" 
          className="h-12 mx-auto"
        />
      </div>
    </section>
  );
}
