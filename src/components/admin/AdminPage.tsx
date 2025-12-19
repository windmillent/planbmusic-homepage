import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Music, 
  Youtube, 
  Bell, 
  Image as ImageIcon, 
  Mail,
  LogOut,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { DashboardTab } from './DashboardTab';
import { AlbumsTab } from './AlbumsTab';
import { YoutubeTab } from './YoutubeTab';
import { PopupsTab } from './PopupsTab';
import { BannerTab } from './BannerTab';
import { ContactMessagesTab } from './ContactMessagesTab';
import { FAQTab } from './FAQTab';

export type AdminTabType = 'dashboard' | 'albums' | 'youtube' | 'popups' | 'banner' | 'contact' | 'faq';

interface AdminPageProps {
  onLogout: () => void;
}

export function AdminPage({ onLogout }: AdminPageProps) {
  const [currentTab, setCurrentTab] = useState<AdminTabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 검색엔진 차단 메타 태그 추가
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    // 타이틀 변경
    const originalTitle = document.title;
    document.title = '관리자 페이지 - PLANB MUSIC';

    return () => {
      document.head.removeChild(metaRobots);
      document.title = originalTitle;
    };
  }, []);

  const menuItems = [
    { id: 'dashboard' as AdminTabType, label: '대시보드', icon: LayoutDashboard },
    { id: 'albums' as AdminTabType, label: '앨범 관리', icon: Music },
    { id: 'youtube' as AdminTabType, label: '유튜브 관리', icon: Youtube },
    { id: 'popups' as AdminTabType, label: '팝업 관리', icon: Bell },
    { id: 'banner' as AdminTabType, label: '배너 관리', icon: ImageIcon },
    { id: 'contact' as AdminTabType, label: '문의 메시지', icon: Mail },
    { id: 'faq' as AdminTabType, label: 'FAQ', icon: HelpCircle },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardTab onTabChange={setCurrentTab} />;
      case 'albums':
        return <AlbumsTab />;
      case 'youtube':
        return <YoutubeTab />;
      case 'popups':
        return <PopupsTab />;
      case 'banner':
        return <BannerTab />;
      case 'contact':
        return <ContactMessagesTab />;
      case 'faq':
        return <FAQTab />;
      default:
        return <DashboardTab onTabChange={setCurrentTab} />;
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white border-r transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
        } lg:translate-x-0`}>
          <div className="p-4 border-b bg-gradient-to-r from-cyan-400 to-purple-500">
            <h2 className="text-white font-bold">관리자 페이지</h2>
          </div>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentTab === item.id
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <Button variant="outline" className="w-full" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </aside>

        {/* Toggle Button for Mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed left-4 top-24 z-50 lg:hidden w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}>
          <div className="p-4 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}