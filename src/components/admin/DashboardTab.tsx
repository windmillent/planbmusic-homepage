import { useState, useEffect } from 'react';
import { Music, Youtube, Bell, Mail, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { AdminTabType } from './AdminPage';

interface DashboardTabProps {
  onTabChange?: (tab: AdminTabType) => void;
}

export function DashboardTab({ onTabChange }: DashboardTabProps) {
  const [stats, setStats] = useState({
    albums: 0,
    videos: 0,
    popups: 0,
    banners: 0,
    messages: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Array<{
    action: string;
    title: string;
    time: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [albumsRes, videosRes, popupsRes, bannersRes, messagesRes] = await Promise.all([
        fetch(`${API_URL}/albums`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_URL}/videos`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_URL}/popups`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_URL}/banners`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_URL}/contact-messages`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
      ]);

      const [albumsData, videosData, popupsData, bannersData, messagesData] = await Promise.all([
        albumsRes.ok ? albumsRes.json() : { albums: [] },
        videosRes.ok ? videosRes.json() : { videos: [] },
        popupsRes.ok ? popupsRes.json() : { popups: [] },
        bannersRes.ok ? bannersRes.json() : { banners: [] },
        messagesRes.ok ? messagesRes.json() : { messages: [] },
      ]);

      setStats({
        albums: albumsData.albums?.length || 0,
        videos: videosData.videos?.length || 0,
        popups: popupsData.popups?.filter((p: any) => p.isActive)?.length || 0,
        banners: bannersData.banners?.filter((b: any) => b.isActive)?.length || 0,
        messages: messagesData.messages?.filter((m: any) => !m.isRead)?.length || 0,
      });

      // Generate recent activities from actual data
      const activities = [];
      
      console.log('=== 최근 활동 데이터 수집 시작 ===');
      console.log('Albums data:', albumsData.albums);
      console.log('Videos data:', videosData.videos);
      console.log('Messages data:', messagesData.messages);
      console.log('Popups data:', popupsData.popups);
      console.log('Banners data:', bannersData.banners);
      
      // Recent albums (최신 3개)
      const recentAlbums = (albumsData.albums || [])
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || a.releaseDate || 0);
          const dateB = new Date(b.createdAt || b.releaseDate || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 3);
      
      console.log('Recent albums:', recentAlbums);
      recentAlbums.forEach((album: any) => {
        const date = new Date(album.createdAt || album.releaseDate);
        if (!isNaN(date.getTime())) {
          activities.push({
            action: '새 앨범 등록',
            title: album.title || '제목 없음',
            time: getRelativeTime(date),
            timestamp: date.getTime(),
          });
        }
      });

      // Recent videos (최신 2개)
      const recentVideos = (videosData.videos || [])
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 2);
      
      console.log('Recent videos:', recentVideos);
      recentVideos.forEach((video: any) => {
        const date = new Date(video.createdAt);
        if (!isNaN(date.getTime())) {
          activities.push({
            action: '유튜브 영상 추가',
            title: video.title || '제목 없음',
            time: getRelativeTime(date),
            timestamp: date.getTime(),
          });
        }
      });

      // Recent messages (최신 3개)
      const recentMessages = (messagesData.messages || [])
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 3);
      
      console.log('Recent messages:', recentMessages);
      recentMessages.forEach((msg: any) => {
        const date = new Date(msg.createdAt);
        if (!isNaN(date.getTime())) {
          activities.push({
            action: '새 문의 접수',
            title: `${msg.name || '이름 없음'} - ${msg.subject || '제목 없음'}`,
            time: getRelativeTime(date),
            timestamp: date.getTime(),
          });
        }
      });

      // Recent popups (최신 2개)
      const recentPopups = (popupsData.popups || [])
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || a.startDate || 0);
          const dateB = new Date(b.createdAt || b.startDate || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 2);
      
      console.log('Recent popups:', recentPopups);
      recentPopups.forEach((popup: any) => {
        const date = new Date(popup.createdAt || popup.startDate);
        if (!isNaN(date.getTime())) {
          activities.push({
            action: '팝업 등록',
            title: popup.title || '제목 없음',
            time: getRelativeTime(date),
            timestamp: date.getTime(),
          });
        }
      });

      // Recent banners (최신 2개)
      const recentBanners = (bannersData.banners || [])
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || a.updatedAt || 0);
          const dateB = new Date(b.createdAt || b.updatedAt || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 2);
      
      console.log('Recent banners:', recentBanners);
      recentBanners.forEach((banner: any) => {
        const date = new Date(banner.createdAt || banner.updatedAt);
        if (!isNaN(date.getTime())) {
          activities.push({
            action: '배너 등록',
            title: banner.title || '제목 없음',
            time: getRelativeTime(date),
            timestamp: date.getTime(),
          });
        }
      });

      // Sort by timestamp and take top 6
      activities.sort((a: any, b: any) => b.timestamp - a.timestamp);
      const finalActivities = activities.slice(0, 6).map(({ timestamp, ...rest }) => rest);
      
      console.log('=== 최종 최근 활동 ===');
      console.log('Final activities:', finalActivities);
      setRecentActivities(finalActivities);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const statCards = [
    { label: '전체 앨범', value: stats.albums, icon: Music, color: 'from-blue-400 to-blue-600', tab: 'albums' },
    { label: '유튜브 동영상', value: stats.videos, icon: Youtube, color: 'from-red-400 to-red-600', tab: 'youtube' },
    { label: '활성 팝업', value: stats.popups, icon: Bell, color: 'from-purple-400 to-purple-600', tab: 'popups' },
    { label: '활성 배너', value: stats.banners, icon: ImageIcon, color: 'from-cyan-400 to-cyan-600', tab: 'banner' },
    { label: '읽지 않은 문의', value: stats.messages, icon: Mail, color: 'from-green-400 to-green-600', tab: 'contact' },
    { label: '총 콘텐츠', value: stats.albums + stats.videos, icon: TrendingUp, color: 'from-pink-400 to-pink-600', tab: 'dashboard' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">대시보드</h1>
        <p className="text-gray-600">PLANB MUSIC 관리자 페이지에 오신 것을 환영합니다.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="border-0 shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => onTabChange && stat.tab !== 'dashboard' && onTabChange(stat.tab as AdminTabType)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">최근 활동이 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.title}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-cyan-400 to-purple-500">
        <CardContent className="p-6">
          <h3 className="text-white text-xl font-bold mb-4">빠른 작업</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => onTabChange && onTabChange('albums')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-lg transition-colors"
            >
              <Music className="w-6 h-6 mb-2 mx-auto" />
              <p>새 앨범 추가</p>
            </button>
            <button 
              onClick={() => onTabChange && onTabChange('youtube')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-lg transition-colors"
            >
              <Youtube className="w-6 h-6 mb-2 mx-auto" />
              <p>유튜브 관리</p>
            </button>
            <button 
              onClick={() => onTabChange && onTabChange('banner')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-lg transition-colors"
            >
              <ImageIcon className="w-6 h-6 mb-2 mx-auto" />
              <p>배너 관리</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}