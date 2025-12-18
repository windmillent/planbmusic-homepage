import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Popup {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  linkUrl?: string;
  isActive: boolean;
  showDetails?: boolean;
  startDate?: string;
  endDate?: string;
}

interface PopupPosition {
  x: number;
  y: number;
}

interface PopupBannerProps {
  currentPage?: string;
}

export function PopupBanner({ currentPage }: PopupBannerProps) {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [temporaryClosedPopups, setTemporaryClosedPopups] = useState<Set<string>>(new Set());
  const [todayClosedPopups, setTodayClosedPopups] = useState<Set<string>>(new Set());
  const [positions, setPositions] = useState<Map<string, PopupPosition>>(new Map());
  const [draggingPopup, setDraggingPopup] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 페이지 변경 시 임시로 닫힌 팝업 초기화 (다시 표시)
  useEffect(() => {
    console.log('Page changed to:', currentPage);
    setTemporaryClosedPopups(new Set());
  }, [currentPage]);

  useEffect(() => {
    // Load "today closed" popups from localStorage
    const stored = localStorage.getItem('closedPopups');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const today = new Date().toDateString();
        
        // Filter out expired "today" closures
        const validClosures = parsed.filter((item: any) => {
          if (item.type === 'today') {
            return item.date === today;
          }
          return false; // 'permanent'은 더 이상 사용하지 않음
        });

        const todaySet = new Set(
          validClosures.map((item: any) => item.id)
        );

        setTodayClosedPopups(todaySet);

        // Update localStorage with valid closures only
        localStorage.setItem('closedPopups', JSON.stringify(validClosures));
      } catch (error) {
        console.error('Error parsing closed popups:', error);
      }
    }

    // Fetch active popups immediately
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      console.log('Fetching popups from:', `${API_URL}/popups`);
      const response = await fetch(`${API_URL}/popups`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      console.log('Popups response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Popups data received:', data);
        
        const activePopups = (data.popups || []).filter((popup: Popup) => {
          if (!popup.isActive) {
            console.log('Popup inactive:', popup.id, popup.title);
            return false;
          }
          
          const now = new Date();
          if (popup.startDate && new Date(popup.startDate) > now) {
            console.log('Popup not started yet:', popup.id, popup.startDate);
            return false;
          }
          if (popup.endDate && new Date(popup.endDate) < now) {
            console.log('Popup expired:', popup.id, popup.endDate);
            return false;
          }
          
          console.log('Popup active and valid:', popup.id, popup.title);
          return true;
        });
        
        console.log('Active popups count:', activePopups.length);
        console.log('Active popups:', activePopups);
        setPopups(activePopups);

        // Initialize positions for new popups
        const newPositions = new Map<string, PopupPosition>();
        activePopups.forEach((popup: Popup, index: number) => {
          newPositions.set(popup.id, {
            x: 32 + (index * 50),
            y: 100,
          });
        });
        setPositions(newPositions);
      } else {
        console.error('Failed to fetch popups, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching popups:', error);
    }
  };

  const handleClose = (popupId: string, closeType: 'today' | 'temporary') => {
    if (closeType === 'today') {
      // "오늘은 그만보기" - localStorage에 저장
      const today = new Date().toDateString();
      const stored = localStorage.getItem('closedPopups');
      let closures = [];
      
      try {
        closures = stored ? JSON.parse(stored) : [];
      } catch (error) {
        closures = [];
      }

      // Remove existing closure for this popup
      closures = closures.filter((item: any) => item.id !== popupId);

      // Add new closure
      closures.push({
        id: popupId,
        type: 'today',
        date: today,
      });

      localStorage.setItem('closedPopups', JSON.stringify(closures));
      setTodayClosedPopups(new Set([...todayClosedPopups, popupId]));
      console.log('Popup closed for today:', popupId);
    } else {
      // "닫기" - 임시로만 닫기 (상태만 변경, localStorage 저장 안함)
      setTemporaryClosedPopups(new Set([...temporaryClosedPopups, popupId]));
      console.log('Popup temporarily closed:', popupId);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, popupId: string) => {
    // 버튼이나 링크 클릭은 무시
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }

    const position = positions.get(popupId);
    if (!position) return;

    setDraggingPopup(popupId);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingPopup) return;

    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };

    setPositions(new Map(positions.set(draggingPopup, newPosition)));
  };

  const handleMouseUp = () => {
    setDraggingPopup(null);
  };

  useEffect(() => {
    if (draggingPopup) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingPopup, dragOffset, positions]);

  const visiblePopups = popups.filter(
    popup => !temporaryClosedPopups.has(popup.id) && !todayClosedPopups.has(popup.id)
  );

  console.log('Visible popups count:', visiblePopups.length);
  console.log('Temporary closed:', Array.from(temporaryClosedPopups));
  console.log('Today closed:', Array.from(todayClosedPopups));

  // 메인 페이지가 아니면 팝업을 표시하지 않음
  if (currentPage !== 'home') {
    return null;
  }

  if (visiblePopups.length === 0) return null;

  return (
    <>
      {visiblePopups.map((popup) => {
        const position = positions.get(popup.id) || { x: 32, y: 100 };
        
        return (
          <div
            key={popup.id}
            className="fixed z-50 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
            style={{
              left: isMobile ? '50%' : `${position.x}px`,
              top: isMobile ? '50%' : `${position.y}px`,
              transform: isMobile ? 'translate(-50%, -50%)' : 'none',
              width: isMobile ? 'calc(100vw - 2rem)' : '576px',
              maxWidth: isMobile ? '400px' : '576px',
              maxHeight: isMobile ? '85vh' : '90vh',
              cursor: !isMobile && draggingPopup === popup.id ? 'grabbing' : !isMobile ? 'grab' : 'default',
            }}
            onMouseDown={(e) => !isMobile && handleMouseDown(e, popup.id)}
          >
            {/* Close Button */}
            <button
              onClick={() => handleClose(popup.id, 'temporary')}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-800/60 hover:bg-gray-800/80 flex items-center justify-center transition-colors"
              style={{ cursor: 'pointer' }}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto" style={{ cursor: 'auto' }}>
              {/* Popup Image */}
              <div className="relative">
                <img
                  src={popup.imageUrl}
                  alt={popup.title}
                  className="w-full h-auto object-cover"
                  draggable={false}
                />
              </div>

              {/* Popup Info */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">📢</span>
                  <h3 className="font-bold text-lg text-gray-900 flex-1">
                    {popup.title}
                  </h3>
                </div>

                {/* Description */}
                {popup.description && (
                  <div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {popup.description}
                  </div>
                )}

                {/* Show Details Link */}
                {popup.showDetails && (popup.buttonLink || popup.linkUrl) && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="flex-shrink-0">🔗</span>
                      <div className="flex-1">
                        <p className="font-medium mb-1">연결 상세 정보 표시</p>
                        <a 
                          href={popup.buttonLink || popup.linkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {popup.buttonLink || popup.linkUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {(popup.buttonText || popup.buttonLink || popup.linkUrl) && (
                  <a
                    href={popup.buttonLink || popup.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-center rounded-lg font-medium transition-all"
                  >
                    {popup.buttonText || '자세히 보기'}
                  </a>
                )}
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handleClose(popup.id, 'today')}
                className="flex-1 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors border-r border-gray-200 font-medium"
                style={{ cursor: 'pointer' }}
              >
                오늘은 그만보기
              </button>
              <button
                onClick={() => handleClose(popup.id, 'temporary')}
                className="flex-1 py-3 text-sm text-gray-900 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                style={{ cursor: 'pointer' }}
              >
                <X className="w-4 h-4" />
                닫기
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}