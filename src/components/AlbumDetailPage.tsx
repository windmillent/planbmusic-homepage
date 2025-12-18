import { useEffect, useState } from 'react';
import { Calendar, ArrowLeft, Play, Youtube } from 'lucide-react';
import { Crown } from 'lucide-react';
import { ServicesSection } from './ServicesSection';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

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
  youtubeUrl?: string;
}

interface AlbumDetailPageProps {
  albumId: string;
  onBack: () => void;
}

export function AlbumDetailPage({ albumId, onBack }: AlbumDetailPageProps) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/albums/${albumId}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAlbum(data.album);
        }
      } catch (error) {
        console.error('Error fetching album:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  const parseTracksToArray = (tracks?: string): string[] => {
    if (!tracks) return [];
    return tracks.split('\n').filter(t => t.trim());
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">앨범을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-cyan-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>앨범 목록으로</span>
          </button>
        </div>
      </div>

      {/* Album Detail Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-[400px_1fr] gap-12">
            {/* Left - Album Cover */}
            <div className="flex flex-col">
              <div className="relative mb-6 bg-white rounded-lg shadow-xl p-6">
                <ImageWithFallback
                  src={album.imageUrl}
                  alt={album.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                {album.isFeatured && (
                  <div className="absolute top-10 right-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Crown className="w-7 h-7 text-white" fill="white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Album Info */}
            <div className="flex flex-col">
              {/* OST Badge */}
              {album.category === 'ost' && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded">
                    OST
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 
                className="text-4xl font-black mb-3 text-gray-900"
                dangerouslySetInnerHTML={{ __html: album.title }}
              />

              {/* Artist */}
              <p 
                className="text-xl text-gray-600 mb-8"
                dangerouslySetInnerHTML={{ __html: album.artist }}
              />

              {/* Album Details Grid */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-cyan-500" />
                  <div>
                    <span className="text-sm text-gray-500">발매일</span>
                    <p className="text-gray-900">{album.releaseDate}</p>
                  </div>
                </div>

                {album.distributor && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">유통사</span>
                      <p className="text-gray-900">{album.distributor}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">카테고리</span>
                    <p className="text-gray-900">{album.category === 'artist' ? '아티스트' : 'OST'}</p>
                  </div>
                </div>

                {album.genre && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">장르</span>
                      <p className="text-gray-900">{album.genre}</p>
                    </div>
                  </div>
                )}

                {parseTracksToArray(album.tracks).length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-gray-500">수록곡</span>
                      <div className="text-gray-900 space-y-1 mt-1">
                        {parseTracksToArray(album.tracks).map((track, index) => (
                          <p key={index} className="text-sm">{track}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* YouTube Button */}
              {album.youtubeUrl && (
                <div className="mb-8">
                  <a
                    href={album.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-cyan-400 text-white rounded-lg font-medium hover:bg-cyan-500 transition-colors"
                  >
                    음원 듣기
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          {album.description && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">앨범소개</h2>
              <div 
                className="album-description"
                dangerouslySetInnerHTML={{ __html: album.description }}
              />
            </div>
          )}

          {/* YouTube Video Section */}
          {album.youtubeUrl && (() => {
            const videoId = getYouTubeVideoId(album.youtubeUrl);
            const thumbnailUrl = videoId 
              ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
              : null;

            return (
              <div className="mt-16 mb-12">
                {/* YouTube Video Card */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Left - Thumbnail */}
                    <div className="relative group cursor-pointer" onClick={() => window.open(album.youtubeUrl, '_blank')}>
                      {thumbnailUrl && (
                        <img
                          src={thumbnailUrl}
                          alt={`${album.title} 썸네일`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to default quality thumbnail if maxres fails
                            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                          }}
                        />
                      )}
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-red-600 group-hover:bg-red-700 group-hover:scale-110 transition-all flex items-center justify-center shadow-2xl">
                          <Play className="w-10 h-10 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>

                    {/* Right - Info */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      {/* YouTube Badge */}
                      <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full w-fit mb-4">
                        <Youtube className="w-4 h-4" fill="white" />
                        <span className="text-sm font-bold">YouTube</span>
                      </div>

                      {/* Title */}
                      <h3 
                        className="text-2xl font-bold text-gray-900 mb-2"
                        dangerouslySetInnerHTML={{ __html: album.title }}
                      />

                      {/* Artist */}
                      <p 
                        className="text-gray-600 mb-4"
                        dangerouslySetInnerHTML={{ __html: album.artist }}
                      />

                      {/* Description */}
                      <p className="text-sm text-gray-500 mb-6">
                        YouTube에서 이 앨범의 음악을 감상하세요
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  {/* YouTube Button */}
                  <a
                    href={album.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Play className="w-5 h-5" fill="white" />
                    <span>바로듣기 (YouTube)</span>
                  </a>

                  {/* Back to List Button */}
                  <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-400 text-white rounded-lg font-bold hover:bg-cyan-500 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>앨범 목록으로</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
}