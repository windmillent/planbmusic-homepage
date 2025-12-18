import { useState, useEffect } from 'react';
import { Youtube, Plus, Edit, Trash2, Star, StarOff, RefreshCw, CheckSquare, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface Video {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
  description?: string;
  isFeatured: boolean;
  isHidden?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface YoutubeVideo {
  videoId: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  isExisting: boolean;
  publishedAt: string;
}

export function YoutubeTab() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncedVideos, setSyncedVideos] = useState<YoutubeVideo[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [selectedVideoIds, setSelectedVideoIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    description: '',
  });

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

  // Fetch videos from Supabase
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/videos`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('비디오 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSave = async () => {
    if (!formData.title || !formData.videoUrl) {
      toast.error('제목과 유튜브 URL은 필수 입력 항목입니다.');
      return;
    }

    const videoId = extractVideoId(formData.videoUrl);
    if (!videoId) {
      toast.error('올바른 유튜브 URL을 입력하세요.');
      return;
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    try {
      setLoading(true);
      if (editingVideo) {
        // Update existing video
        const response = await fetch(`${API_URL}/videos/${editingVideo.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            videoId,
            thumbnail: thumbnailUrl,
            description: formData.description,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to update video');
        }
        toast.success('비디오가 수정되었습니다.');
      } else {
        // Create new video
        const response = await fetch(`${API_URL}/videos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            videoId,
            thumbnail: thumbnailUrl,
            isFeatured: false,
            description: formData.description,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to create video');
        }
        toast.success('새 비디오가 추가되었습니다.');
      }
      await fetchVideos();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('비디오 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
      description: video.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete video');
      }
      toast.success('비디오가 삭제되었습니다.');
      await fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('비디오 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/videos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFeatured: !currentFeatured,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle featured');
      }
      toast.success(currentFeatured ? '추천 영상에서 제거되었습니다.' : '추천 영상으로 설정되었습니다.');
      await fetchVideos();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('추천 영상 설정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', videoUrl: '', description: '' });
    setEditingVideo(null);
  };

  const featuredVideo = videos.find(v => v.isFeatured);

  // Sync videos from YouTube channel
  const handleSync = async () => {
    try {
      setLoading(true);
      toast.info('유튜브 채널에서 영상 목록을 가져오는 중...');
      
      const response = await fetch(`${API_URL}/videos/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sync failed');
      }

      const result = await response.json();
      setSyncedVideos(result.videos || []);
      setSelectedVideos(new Set());
      setIsSyncDialogOpen(true);
      toast.success(`${result.total}개 영상을 찾았습니다. (이미 추가됨: ${result.existing}개)`);
    } catch (error) {
      console.error('Error syncing videos:', error);
      toast.error(`동기화 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVideo = (videoId: string) => {
    const newSelectedVideos = new Set(selectedVideos);
    if (newSelectedVideos.has(videoId)) {
      newSelectedVideos.delete(videoId);
    } else {
      newSelectedVideos.add(videoId);
    }
    setSelectedVideos(newSelectedVideos);
  };

  const handleAddSelectedVideos = async () => {
    if (selectedVideos.size === 0) {
      toast.error('선택된 영상이 없습니다.');
      return;
    }

    try {
      setLoading(true);
      toast.info(`${selectedVideos.size}개 영상을 추가 중입니다...`);
      
      const videosToAdd = syncedVideos.filter(v => selectedVideos.has(v.videoId));
      
      const response = await fetch(`${API_URL}/videos/bulk-add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videos: videosToAdd,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Add failed');
      }

      const result = await response.json();
      toast.success(result.message);
      await fetchVideos();
      setIsSyncDialogOpen(false);
      setSelectedVideos(new Set());
      setSyncedVideos([]);
    } catch (error) {
      console.error('Error adding selected videos:', error);
      toast.error(`추가 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedVideoIds.size === videos.length) {
      setSelectedVideoIds(new Set());
    } else {
      setSelectedVideoIds(new Set(videos.map(v => v.id)));
    }
  };

  const toggleSelectVideo = (id: string) => {
    const newSelected = new Set(selectedVideoIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedVideoIds(newSelected);
  };

  // 일괄 삭제
  const handleBulkDelete = async () => {
    if (selectedVideoIds.size === 0) {
      toast.error('삭제할 영상을 선택해주세요.');
      return;
    }

    if (!confirm(`${selectedVideoIds.size}개의 영상을 삭제하시겠습니까?`)) return;

    try {
      setLoading(true);
      const deletePromises = Array.from(selectedVideoIds).map(id =>
        fetch(`${API_URL}/videos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        })
      );

      await Promise.all(deletePromises);
      toast.success(`${selectedVideoIds.size}개의 영상이 삭제되었습니다.`);
      setSelectedVideoIds(new Set());
      await fetchVideos();
    } catch (error) {
      console.error('Error bulk deleting videos:', error);
      toast.error('일괄 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">유튜브 관리</h1>
          <p className="text-gray-600">유튜브 영상을 추가하고 관리합니다. 하나의 영상을 추천 영상으로 설정할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={loading}
            className="flex items-center gap-2 border-2 border-purple-400 text-purple-700 hover:bg-purple-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            유튜브 동기화
          </Button>
          <Button 
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            새 영상 추가
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">총 영상 수</p>
                <p className="text-3xl font-bold">{videos.length}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                <Youtube className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">추천 영상</p>
                <p className="text-3xl font-bold">{featuredVideo ? '1' : '0'}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">일반 영상</p>
                <p className="text-3xl font-bold">{videos.length - (featuredVideo ? 1 : 0)}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <Youtube className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Videos Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 space-y-4">
          {videos.length > 0 && (
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                onClick={toggleSelectAll}
                className="flex items-center gap-2"
              >
                {selectedVideoIds.size === videos.length && videos.length > 0 ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                전체 선택
              </Button>
              {selectedVideoIds.size > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  선택 항목 삭제 ({selectedVideoIds.size})
                </Button>
              )}
            </div>
          )}
          
          {loading && videos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">로딩 중...</div>
          ) : videos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">등록된 영상이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-2 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedVideoIds.size === videos.length && videos.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">제목</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">영상 ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">상태</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {videos.map((video) => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-2 py-4">
                        <input
                          type="checkbox"
                          checked={selectedVideoIds.has(video.id)}
                          onChange={() => toggleSelectVideo(video.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {video.isFeatured && <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />}
                          <p className="font-medium text-gray-900 max-w-md truncate">{video.title}</p>
                        </div>
                        {video.description && (
                          <p className="text-sm text-gray-500 max-w-md truncate mt-1">{video.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-sm">{video.videoId}</td>
                      <td className="px-6 py-4">
                        {video.isFeatured ? (
                          <Badge className="bg-yellow-500">추천</Badge>
                        ) : (
                          <Badge variant="outline">일반</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleFeatured(video.id, video.isFeatured)}
                            title={video.isFeatured ? "추천 해제" : "추천 설정"}
                          >
                            {video.isFeatured ? (
                              <StarOff className="w-4 h-4" />
                            ) : (
                              <Star className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(video)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(video.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Video Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingVideo ? '영상 수정' : '새 영상 추가'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">영상 제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="영상 제목을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">유튜브 URL *</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-sm text-gray-500 mt-1">
                * 유튜브 영상 URL 또는 비디오 ID를 입력하세요
              </p>
            </div>
            {formData.videoUrl && extractVideoId(formData.videoUrl) && (
              <div>
                <Label>미리보기</Label>
                <div className="mt-2 relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${extractVideoId(formData.videoUrl)}`}
                    title="미리보기"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="영상에 대한 설명을 입력하세요"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
              <Button 
                onClick={handleSave} 
                className="bg-gradient-to-r from-red-500 to-red-600"
                disabled={loading}
              >
                {loading ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sync Dialog */}
      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>유튜브 채널 동기화</DialogTitle>
            <p className="text-sm text-gray-600">추가할 영상을 선택하세요 (이미 추가된 영상은 회색으로 표시됩니다)</p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                총 {syncedVideos.length}개 영상 | 선택됨: {selectedVideos.size}개
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newVideos = syncedVideos.filter(v => !v.isExisting);
                    setSelectedVideos(new Set(newVideos.map(v => v.videoId)));
                  }}
                >
                  새 영상 전체 선택
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedVideos(new Set())}
                >
                  선택 해제
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {syncedVideos.map((video) => (
                <div
                  key={video.videoId}
                  onClick={() => !video.isExisting && handleSelectVideo(video.videoId)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    video.isExisting 
                      ? 'bg-gray-100 cursor-not-allowed opacity-60' 
                      : selectedVideos.has(video.videoId)
                      ? 'bg-purple-50 border-purple-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {video.isExisting ? (
                        <Square className="w-5 h-5 text-gray-400" />
                      ) : selectedVideos.has(video.videoId) ? (
                        <CheckSquare className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 line-clamp-2">{video.title}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500">{video.videoId}</span>
                        {video.isExisting && (
                          <Badge variant="outline" className="text-xs">이미 추가됨</Badge>
                        )}
                      </div>
                    </div>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-32 h-18 object-cover rounded flex-shrink-0"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsSyncDialogOpen(false)}>취소</Button>
              <Button 
                onClick={handleAddSelectedVideos} 
                className="bg-gradient-to-r from-purple-500 to-purple-600"
                disabled={loading || selectedVideos.size === 0}
              >
                {loading ? '추가 중...' : `${selectedVideos.size}개 영상 추가`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}