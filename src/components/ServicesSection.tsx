import { Music, DollarSign, Globe, TrendingUp, FileText, Shield } from 'lucide-react';
import logoImage from 'figma:asset/fabf5b77515cd8a456d8c0e44608a2495763767c.png';

export function ServicesSection() {
  const services = [
    { title: 'Music Distribution', icon: Music },
    { title: 'Royalty Settlement', icon: DollarSign },
    { title: 'Global Marketing', icon: Globe },
    { title: 'Production & Investment', icon: TrendingUp },
    { title: 'Music Licensing', icon: FileText },
    { title: 'Rights Management', icon: Shield },
  ];

  return (
    <section className="py-12 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Logo */}
            <div>
              <img 
                src={logoImage}
                alt="PLANB MUSIC" 
                className="h-28 mt-8"
              />
            </div>

            {/* Services Grid */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm">{service.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
