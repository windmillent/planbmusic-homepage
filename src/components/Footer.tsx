import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white">T</span>
              </div>
              <span className="text-white">TechCorp</span>
            </div>
            <p className="text-sm">
              혁신적인 기술로 더 나은 미래를 만들어갑니다.
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">회사</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">회사소개</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">서비스</a></li>
              <li><a href="#team" className="hover:text-white transition-colors">팀</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">연락처</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">웹 개발</a></li>
              <li><a href="#" className="hover:text-white transition-colors">모바일 앱</a></li>
              <li><a href="#" className="hover:text-white transition-colors">클라우드</a></li>
              <li><a href="#" className="hover:text-white transition-colors">컨설팅</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">소셜 미디어</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {currentYear} TechCorp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
