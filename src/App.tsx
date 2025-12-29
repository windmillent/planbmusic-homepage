import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { DistributionPage } from './components/DistributionPage';
import { AlbumsPage } from './components/AlbumsPage';
import { AlbumDetailPage } from './components/AlbumDetailPage';
import { MediaPage } from './components/MediaPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { FAQPage } from './components/FAQPage';
import { AdminPage } from './components/admin/AdminPage';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { PopupBanner } from './components/PopupBanner';
import { Toaster } from './components/ui/sonner';
import { projectId, publicAnonKey } from './utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

export type PageType = 'home' | 'distribution' | 'albums' | 'album-detail' | 'media' | 'about' | 'contact' | 'faq' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Initialize page from URL hash on mount
  useEffect(() => {
    const initializeFromHash = () => {
      const hash = window.location.hash.slice(1) || '/';
      // 쿼리 파라미터 포함한 전체 경로 파싱
      const [pathPart] = hash.split('?');
      const path = pathPart.split('/').filter(Boolean);
      
      if (path.length === 0) {
        setCurrentPage('home');
      } else if (path[0] === 'albums' && path[1]) {
        setCurrentPage('album-detail');
        setSelectedAlbumId(path[1]);
      } else {
        const pageMap: Record<string, PageType> = {
          'albums': 'albums',
          'media': 'media',
          'about': 'about',
          'contact': 'contact',
          'faq': 'faq',
          'admin': 'admin',
          'distribution': 'distribution',
        };
        setCurrentPage(pageMap[path[0]] || 'home');
      }
    };

    initializeFromHash();

    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyAdminToken(token);
    }
    
    initializeFAQs();
  }, []);

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(1) || '/';
      // 쿼리 파라미터 포함한 전체 경로 파싱
      const [pathPart] = hash.split('?');
      const path = pathPart.split('/').filter(Boolean);
      
      if (path.length === 0) {
        setCurrentPage('home');
        setSelectedAlbumId(null);
      } else if (path[0] === 'albums' && path[1]) {
        setCurrentPage('album-detail');
        setSelectedAlbumId(path[1]);
      } else {
        const pageMap: Record<string, PageType> = {
          'albums': 'albums',
          'media': 'media',
          'about': 'about',
          'contact': 'contact',
          'faq': 'faq',
          'admin': 'admin',
          'distribution': 'distribution',
        };
        setCurrentPage(pageMap[path[0]] || 'home');
        setSelectedAlbumId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    // hashchange 이벤트도 추가 (뒤로가기 시 확실히 감지)
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const initializeFAQs = async () => {
    try {
      await fetch(`${API_URL}/faqs/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      // Silent initialization - no need to show messages
    } catch (error) {
      console.error('Error initializing FAQs:', error);
    }
  };

  const verifyAdminToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setIsAdminAuthenticated(true);
        setAdminToken(token);
      } else {
        localStorage.removeItem('adminToken');
        setIsAdminAuthenticated(false);
        setAdminToken(null);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('adminToken');
      setIsAdminAuthenticated(false);
      setAdminToken(null);
    }
  };

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = async () => {
    if (adminToken) {
      try {
        await fetch(`${API_URL}/admin/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ token: adminToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    setCurrentPage('home');
    // Update URL hash when logging out
    window.history.pushState(null, '', '#/');
  };

  const handleAlbumClick = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setCurrentPage('album-detail');
    // location.hash로 변경하면 자동으로 히스토리에 추가됨
    window.location.hash = `/albums/${albumId}`;
    // Scroll to top when navigating to album detail
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToAlbums = () => {
    // 브라우저 뒤로가기 사용 (이전 페이지 번호 유지)
    window.history.back();
  };

  // Navigation handler that updates URL hash
  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    setSelectedAlbumId(null);
    
    // Update URL hash based on page
    const hashMap: Record<PageType, string> = {
      'home': '#/',
      'distribution': '#/distribution',
      'albums': '#/albums',
      'album-detail': '#/albums', // fallback
      'media': '#/media',
      'about': '#/about',
      'contact': '#/contact',
      'faq': '#/faq',
      'admin': '#/admin',
    };
    
    window.history.pushState(null, '', hashMap[page] || '#/');
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'distribution':
        return <DistributionPage onNavigate={handleNavigate} />;
      case 'albums':
        return <AlbumsPage onAlbumClick={handleAlbumClick} />;
      case 'album-detail':
        return selectedAlbumId ? (
          <AlbumDetailPage albumId={selectedAlbumId} onBack={handleBackToAlbums} />
        ) : (
          <AlbumsPage onAlbumClick={handleAlbumClick} />
        );
      case 'media':
        return <MediaPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FAQPage onNavigate={handleNavigate} />;
      case 'admin':
        // Show login page if not authenticated, otherwise show admin page
        return isAdminAuthenticated ? (
          <AdminPage onLogout={handleAdminLogout} />
        ) : (
          <AdminLoginPage onLoginSuccess={handleAdminLogin} />
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {renderPage()}
      </main>
      <PopupBanner currentPage={currentPage} />
      <Toaster />
    </div>
  );
}
