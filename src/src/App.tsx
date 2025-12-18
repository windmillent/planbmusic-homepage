import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { HomePage } from '../components/HomePage';
import { DistributionPage } from '../components/DistributionPage';
import { AlbumsPage } from '../components/AlbumsPage';
import { AlbumDetailPage } from '../components/AlbumDetailPage';
import { MediaPage } from '../components/MediaPage';
import { AboutPage } from '../components/AboutPage';
import { ContactPage } from '../components/ContactPage';
import { FAQPage } from '../components/FAQPage';
import { AdminPage } from '../components/admin/AdminPage';
import { AdminLoginPage } from '../components/admin/AdminLoginPage';
import { PopupBanner } from '../components/PopupBanner';
import { Toaster } from '../components/ui/sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

export type PageType = 'home' | 'distribution' | 'albums' | 'album-detail' | 'media' | 'about' | 'contact' | 'faq' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Check for existing admin session on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyAdminToken(token);
    }
    
    // Initialize FAQs on first load
    initializeFAQs();
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
  };

  const handleAlbumClick = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setCurrentPage('album-detail');
  };

  const handleBackToAlbums = () => {
    setSelectedAlbumId(null);
    setCurrentPage('albums');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'distribution':
        return <DistributionPage onNavigate={setCurrentPage} />;
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
        return <FAQPage onNavigate={setCurrentPage} />;
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
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <PopupBanner currentPage={currentPage} />
      <Toaster />
    </div>
  );
}
