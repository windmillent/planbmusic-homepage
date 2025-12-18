import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../App';
import logoImage from 'figma:asset/ad64750a24ee1f916279c7ed992d0faf79f9620b.png';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'distribution' as PageType, label: 'Distribution' },
    { id: 'albums' as PageType, label: 'Albums' },
    { id: 'media' as PageType, label: 'Media' },
    { id: 'about' as PageType, label: 'About us' },
    { id: 'contact' as PageType, label: 'Contact' },
    { id: 'faq' as PageType, label: 'FAQ' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center">
            <img 
              src={logoImage}
              alt="PLANB MUSIC" 
              className="h-10"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-12">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="transition-all"
                style={{ 
                  fontFamily: 'Pretendard, -apple-system, sans-serif',
                  fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
                  fontWeight: currentPage === item.id ? '700' : '500',
                  color: currentPage === item.id ? 'rgb(34, 197, 194)' : '#000000'
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Admin Button + Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* Admin Button - Desktop only */}
            <button
              onClick={() => onNavigate('admin')}
              className="hidden lg:flex w-8 h-8 rounded-lg border-2 border-cyan-400 items-center justify-center hover:bg-cyan-50 transition-colors"
              title="관리자 페이지"
            >
              <Shield className="w-4 h-4 text-cyan-500" />
            </button>
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 flex flex-col gap-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`text-left py-2 px-4 rounded-lg transition-colors ${
                  currentPage === item.id ? 'text-cyan-400 bg-cyan-50' : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {/* Admin Button in Mobile Menu */}
            <button
              onClick={() => {
                onNavigate('admin');
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2 px-4 rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors"
            >
              <Shield className="w-4 h-4" />
              관리자 페이지
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}