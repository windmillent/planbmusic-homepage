import { useState, useEffect } from 'react';
import { Crown, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedGradientHeader } from './AnimatedGradientHeader';
import { ServicesSection } from './ServicesSection';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Badge {
  className?: string;
  children: React.ReactNode;
}

function Badge({ className, children }: Badge) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${className}`}>
      {children}
    </span>
  );
}

interface Album {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  imageUrl: string;
  category: string;
  type: 'OST' | 'DISTRIBUTION' | null;
  distributor?: string;
  genre?: string;
  tracks?: string;
  description?: string;
  isFeatured?: boolean;
  isHidden?: boolean;
}

interface AlbumsPageProps {
  onAlbumClick?: (albumId: string) => void;
}

export function AlbumsPage({ onAlbumClick }: AlbumsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [banner, setBanner] = useState<any>(null);
  const itemsPerPage = 12;

  // URL에서 페이지 번호와 카테고리 읽기
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const pageParam = params.get('page');
    const categoryParam = params.get('category');
    
    if (pageParam) {
      const pageNum = parseInt(pageParam, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  // SEO: 앨범 페이지 메타 태그 설정
  useEffect(() => {
    document.title = 'Albums - PLANB MUSIC | 음악 앨범 카탈로그';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'PLANB MUSIC이 유통하는 다양한 앨범과 OST를 만나보세요. 국내외 아티스트의 최신 음악.');
    }
  }, []);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

  // Fetch albums and banner from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [albumsResponse, bannerResponse] = await Promise.all([
          fetch(`${API_URL}/albums`, {
            headers: { 'Authorization': `Bearer ${publicAnonKey}` },
          }),
          fetch(`${API_URL}/banners/albums-page`, {
            headers: { 'Authorization': `Bearer ${publicAnonKey}` },
          }),
        ]);

        // 앨범 데이터 처리
        if (albumsResponse.ok) {
          const albumsData = await albumsResponse.json();
          const visibleAlbums = (albumsData.albums || []).filter((album: Album) => !album.isHidden);
          setAlbums(visibleAlbums);
        }

        // 배너 데이터 처리
        if (bannerResponse.ok) {
          const bannerData = await bannerResponse.json();
          if (bannerData.banner && bannerData.banner.isActive) {
            setBanner(bannerData.banner);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 카테고리가 변경될 때 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
    updateURL(1, selectedCategory);
  }, [selectedCategory]);

  // URL 업데이트 함수
  const updateURL = (page: number, category: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (category !== '전체') params.set('category', category);
    
    const queryString = params.toString();
    const newHash = queryString ? `/albums?${queryString}` : '/albums';
    
    // location.hash 사용 (브라우저 히스토리에 자동 추가)
    window.location.hash = newHash;
  };

  const categories = [
    { id: 'all', label: '전체', count: albums.length },
    { id: 'artist', label: '아티스트', count: albums.filter(a => a.category === 'artist').length },
    { id: 'ost', label: 'OST', count: albums.filter(a => a.category === 'ost').length },
  ];

  // 정렬: 추천순 (추천 앨범 우선 + 날짜 최신순)
  const getSortedAlbums = (albums: Album[]) => {
    return [...albums].sort((a, b) => {
      // 추천 앨범이 먼저 오도록
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // 추천 여부가 같으면 날짜 최신순
      const dateA = new Date(a.releaseDate || '1970-01-01').getTime();
      const dateB = new Date(b.releaseDate || '1970-01-01').getTime();
      return dateB - dateA;
    });
  };

  // 카테고리 필터링: 한글 label을 영어 id로 매핑
  const getCategoryId = (label: string) => {
    const category = categories.find(c => c.label === label);
    return category ? category.id : 'all';
  };

  const filteredAlbums = selectedCategory === '전체' 
    ? albums 
    : albums.filter(album => album.category === getCategoryId(selectedCategory));
  
  const sortedAlbums = getSortedAlbums(filteredAlbums);

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedAlbums.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAlbums.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    updateURL(pageNumber, selectedCategory);
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
    <div className="pt-20 min-h-screen">
      {/* Banner or Header Section */}
      {banner ? (
        <>
          {/* Banner Image */}
          <section className="bg-white py-8">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-lg">
                {banner.link ? (
                  <a href={banner.link} className="block relative group">
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title}
                      className="w-full h-auto transition-transform group-hover:scale-105"
                      style={{ maxHeight: '450px', objectFit: 'cover' }}
                      loading="eager"
                      decoding="async"
                    />
                    {(banner.title || banner.subtitle) && (
                      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-8 transition-opacity group-hover:bg-black/40">
                        {banner.title && (
                          <h2 
                            className="text-white font-bold text-center mb-2"
                            style={{ 
                              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                              color: banner.textColor || '#ffffff',
                              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}
                          >
                            {banner.title}
                          </h2>
                        )}
                        {banner.subtitle && (
                          <p 
                            className="text-white/90 text-center"
                            style={{ 
                              fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
                              color: banner.textColor || '#ffffff',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}
                          >
                            {banner.subtitle}
                          </p>
                        )}
                        {banner.buttonText && (
                          <button 
                            className="mt-4 px-6 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg font-medium transition-colors"
                          >
                            {banner.buttonText}
                          </button>
                        )}
                      </div>
                    )}
                  </a>
                ) : (
                  <div className="relative">
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title}
                      className="w-full h-auto"
                      style={{ maxHeight: '450px', objectFit: 'cover' }}
                    />
                    {(banner.title || banner.subtitle) && (
                      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-8">
                        {banner.title && (
                          <h2 
                            className="text-white font-bold text-center mb-2"
                            style={{ 
                              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                              color: banner.textColor || '#ffffff',
                              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}
                          >
                            {banner.title}
                          </h2>
                        )}
                        {banner.subtitle && (
                          <p 
                            className="text-white/90 text-center"
                            style={{ 
                              fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
                              color: banner.textColor || '#ffffff',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}
                          >
                            {banner.subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Title and Headline on White Background */}
          <section className="bg-white py-12">
            <div className="container mx-auto px-4 lg:px-8">
              <h1 className="text-gray-900 text-center font-black mb-4" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', letterSpacing: '-0.02em' }}>
                Albums
              </h1>
              <p className="text-gray-700 text-center" style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', fontWeight: '500' }}>
                시대를 초월한 명반부터 최신 K-Contents까지, 숫자로 증명된 플랜비뮤직의 유통 포트폴리오를 확인하세요.
              </p>
            </div>
          </section>
        </>
      ) : (
        /* No Banner - Gradient Header */
        <AnimatedGradientHeader 
          title="Albums" 
          subtitle="시대를 초월한 명반부터 최신 K-Contents까지, 숫자로 증명된 플랜비뮤직의 유통 포트폴리오를 확인하세요."
        />
      )}

      {/* Filters */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.label)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category.label
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent"></div>
              <p className="mt-4 text-gray-500">앨범을 불러오는 중...</p>
            </div>
          ) : sortedAlbums.length === 0 ? (
            <div className="text-center py-20 text-gray-500">등록된 앨범이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentItems.map((album) => (
                <div 
                  key={album.id} 
                  className="group cursor-pointer"
                  onClick={() => onAlbumClick && onAlbumClick(album.id)}
                >
                  <div className="relative mb-4 overflow-hidden rounded-lg shadow-lg">
                    {album.isFeatured && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                          <Crown className="w-6 h-6 text-white" fill="white" />
                        </div>
                      </div>
                    )}
                    {album.type && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge 
                          className={`${
                            album.type === 'OST' 
                              ? 'bg-red-500 hover:bg-red-600' 
                              : 'bg-purple-500 hover:bg-purple-600'
                          } text-white`}
                        >
                          {album.type}
                        </Badge>
                      </div>
                    )}
                    <ImageWithFallback
                      src={album.imageUrl}
                      alt={album.title}
                      className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      {album.isFeatured && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-1" />}
                      <h3 
                        className="line-clamp-2 text-gray-900 flex-1"
                        style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: '500', 
                          lineHeight: '1.5' 
                        }}
                        dangerouslySetInnerHTML={{ __html: album.title }}
                      />
                    </div>
                    <p 
                      className="text-gray-600 text-sm mb-1"
                      style={{ fontWeight: '400' }}
                      dangerouslySetInnerHTML={{ __html: album.artist }}
                    />
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{album.releaseDate}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-8 bg-gray-50">
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
                총 {sortedAlbums.length}개 앨범 중 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedAlbums.length)}개 표시
              </p>
              <p className="text-sm text-gray-400">
                페이지를 기준 리스트순으로 표출합니다
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
}