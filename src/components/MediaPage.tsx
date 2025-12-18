import { useState, useEffect } from 'react';
import { ExternalLink, Play, Calendar, Film } from 'lucide-react';
import { AnimatedGradientHeader } from './AnimatedGradientHeader';
import { ServicesSection } from './ServicesSection';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Video {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
  description?: string;
  isFeatured: boolean;
  createdAt?: string;
}

export function MediaPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;
  const YOUTUBE_CHANNEL = 'https://youtube.com/@planbmusickr';

  // Fetch videos from Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/videos`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const allVideos = data.videos || [];
          setVideos(allVideos);
          
          // Set initial current video (featured or first video)
          const featured = allVideos.find((v: Video) => v.isFeatured);
          setCurrentVideo(featured || allVideos[0] || null);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleVideoClick = (video: Video) => {
    setCurrentVideo(video);
    // Scroll to top to show the video player
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const regularVideos = videos.filter(v => !v.isFeatured);
  const filteredVideos = regularVideos;
  const totalVideos = videos.length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVideos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지 번호 표시 로직 (최대 7개만 표시)
  const getPageNumbers = () => {
    const maxVisible = 7;
    const pages = [];
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변으로 표시
      let start = Math.max(1, currentPage - 3);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header Section with Gradient */}
      <AnimatedGradientHeader 
        title="Media" 
        subtitle="플랜비뮤직의 모든 영상과 플로그 콘텐츠를 만나보세요"
      />

      {/* Hot Content Section - 큰 화면 영상 재생 */}
      {currentVideo && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-black mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                  PL<span style={{ color: '#a855f7' }}>A</span>N<span style={{ color: '#a855f7' }}>B</span>'s Contents
                </h2>
                <p className="text-gray-600">지금 가장 보고싶은 플랜비 뮤직의 음악 스토리</p>
              </div>

              {/* Featured Video Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Video Player - 실제 재생 */}
                <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
                  {currentVideo.isFeatured && (
                    <span className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
                      HOT CONTENT
                    </span>
                  )}
                  <iframe
                    key={currentVideo.videoId}
                    className="absolute top-0 left-0 w-full h-full"
                    src={getYouTubeEmbedUrl(currentVideo.videoId)}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Info */}
                <div className="p-6">
                  {currentVideo.createdAt && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(currentVideo.createdAt)}</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-black text-gray-900 mb-3">
                    {currentVideo.title}
                  </h3>
                  {currentVideo.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {currentVideo.description}
                    </p>
                  )}
                  <a
                    href={`https://www.youtube.com/watch?v=${currentVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                  >
                    YouTube에서 보기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* YouTube Videos Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">YouTube 영상</h2>
              <p className="text-gray-600">플랜비뮤직의 YouTube 영상들을 만나보세요</p>
            </div>

            {/* Video Grid */}
            {loading ? (
              <div className="text-center py-20 text-gray-500">로딩 중...</div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-20 text-gray-500">등록된 영상이 없습니다.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((video) => (
                  <div 
                    key={video.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  >
                    {/* Thumbnail */}
                    <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
                      <span className="absolute top-3 left-3 z-10 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        YOUTUBE
                      </span>
                      {currentVideo?.id === video.id && (
                        <span className="absolute top-3 right-3 z-10 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                          NOW PLAYING
                        </span>
                      )}
                      <img
                        src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-110 transition-all">
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      {video.createdAt && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(video.createdAt)}</span>
                        </div>
                      )}
                      <h3 className="text-base font-black text-gray-900 mb-2 line-clamp-2" style={{ lineHeight: '1.4' }}>
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoClick(video);
                        }}
                        className="inline-flex items-center justify-center w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        상단에서 재생
                        <Play className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <section className="py-8 bg-gray-50 mt-8">
                <div className="container mx-auto px-4 lg:px-8">
                  <div className="flex flex-col items-center gap-3">
                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded transition-all ${
                          currentPage === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-700 hover:text-cyan-500'
                        }`}
                      >
                        ‹
                      </button>
                      
                      {getPageNumbers().map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-1 rounded transition-all ${
                            currentPage === pageNumber
                              ? 'bg-cyan-400 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded transition-all ${
                          currentPage === totalPages 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-700 hover:text-cyan-500'
                        }`}
                      >
                        ›
                      </button>
                    </div>
                    
                    {/* Info Text */}
                    <p className="text-sm text-gray-500">
                      총 {filteredVideos.length}개 영상 중 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredVideos.length)}개 표시
                    </p>
                    <p className="text-sm text-gray-400">
                      페이지를 기준 리스트순으로 표출합니다
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
}