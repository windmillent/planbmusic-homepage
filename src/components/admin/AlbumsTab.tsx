import { useState, useEffect } from 'react';
import { Plus, Search, Upload, Download, Crown, Edit, Trash2, ArrowUpDown, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface Album {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  category: string;
  imageUrl: string;
  distributor?: string;
  description?: string;
  youtubeUrl?: string;
  isFeatured?: boolean;
  isHidden?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type SortType = 'date-desc' | 'date-asc' | 'featured';

export function AlbumsTab() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('date-desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    releaseDate: '',
    category: '',
    imageUrl: '',
    distributor: '(주)플랜비뮤직',
    description: '',
    youtubeUrl: '',
    isFeatured: false,
    isHidden: false,
  });

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

  // Fetch albums from Supabase
  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/albums`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await response.json();
      setAlbums(data.albums || []);
    } catch (error) {
      console.error('Error fetching albums:', error);
      toast.error('앨범 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.artist || !formData.releaseDate) {
      toast.error('제목, 아티스트, 발매일은 필수 입력 항목입니다.');
      return;
    }

    try {
      setLoading(true);
      if (editingAlbum) {
        // Update existing album
        const response = await fetch(`${API_URL}/albums/${editingAlbum.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to update album');
        }
        toast.success('앨범이 수정되었습니다.');
      } else {
        // Create new album
        const response = await fetch(`${API_URL}/albums`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to create album');
        }
        toast.success('새 앨범이 추가되었습니다.');
      }
      await fetchAlbums();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving album:', error);
      toast.error('앨범 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title || '',
      artist: album.artist || '',
      releaseDate: album.releaseDate || '',
      category: album.category || '',
      imageUrl: album.imageUrl || '',
      distributor: album.distributor || '(주)플랜비뮤직',
      description: album.description || '',
      youtubeUrl: album.youtubeUrl || '',
      isFeatured: album.isFeatured || false,
      isHidden: album.isHidden || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/albums/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete album');
      }
      toast.success('앨범이 삭제되었습니다.');
      await fetchAlbums();
    } catch (error) {
      console.error('Error deleting album:', error);
      toast.error('앨범 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error('삭제할 앨범을 선택해주세요.');
      return;
    }

    if (!confirm(`${selectedIds.size}개의 앨범을 삭제하시겠습니까?`)) return;

    try {
      setLoading(true);
      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`${API_URL}/albums/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        })
      );

      await Promise.all(deletePromises);
      toast.success(`${selectedIds.size}개의 앨범이 삭제되었습니다.`);
      setSelectedIds(new Set());
      await fetchAlbums();
    } catch (error) {
      console.error('Error bulk deleting albums:', error);
      toast.error('일괄 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleHidden = async (id: string, currentHidden: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/albums/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isHidden: !currentHidden }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle hidden');
      }
      await fetchAlbums();
      toast.success(!currentHidden ? '앨범을 숨겼습니다.' : '앨범을 표시했습니다.');
    } catch (error) {
      console.error('Error toggling hidden:', error);
      toast.error('상태 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      releaseDate: '',
      category: '',
      imageUrl: '',
      distributor: '(주)플랜비뮤직',
      description: '',
      youtubeUrl: '',
      isFeatured: false,
      isHidden: false,
    });
    setEditingAlbum(null);
  };

  // Excel/CSV 파일 업로드 및 일괄 등록
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const isCsv = file.name.endsWith('.csv');

    if (!isExcel && !isCsv) {
      toast.error('Excel(.xlsx, .xls) 또는 CSV 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setLoading(true);
      let rows: any[][] = [];

      if (isExcel) {
        // Excel 파일 처리
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false, defval: '' }) as any[][];
      } else {
        // CSV 파일 처리
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        rows = lines.map(line => line.split(',').map(v => v.trim().replace(/^"|"$/g, '')));
      }

      if (rows.length < 2) {
        toast.error('파일이 비어있습니다.');
        return;
      }

      // 첫 줄은 헤더이므로 제외
      const dataRows = rows.slice(1);
      let successCount = 0;
      let errorCount = 0;

      for (const row of dataRows) {
        if (row.length < 6) {
          errorCount++;
          continue;
        }

        const [category, title, artist, releaseDate, distributor, description, imageUrl, youtubeUrl, isFeaturedStr, isHiddenStr] = row;

        // 필수 필드 검증
        if (!title || !artist || !releaseDate) {
          errorCount++;
          continue;
        }

        // 카테고리 통일 (한글/영어/대소문자 모두 허용 -> 소문자 영어로 통일)
        let normalizedCategory = category?.toString().toLowerCase() || '';
        if (normalizedCategory === '아티스트' || normalizedCategory === 'artist') {
          normalizedCategory = 'artist';
        } else if (normalizedCategory === 'ost') {
          normalizedCategory = 'ost';
        }

        // 앨범 등록
        try {
          const albumData = {
            category: normalizedCategory,
            title: title?.toString() || '',
            artist: artist?.toString() || '',
            releaseDate: releaseDate?.toString() || '',
            distributor: distributor?.toString() || '(주)플랜비뮤직',
            // description을 HTML 형식 그대로 저장
            description: description?.toString() || '',
            imageUrl: imageUrl?.toString() || '',
            youtubeUrl: youtubeUrl?.toString() || '',
            isFeatured: isFeaturedStr?.toString().toLowerCase() === 'y' || 
                        isFeaturedStr?.toString() === '1' || 
                        isFeaturedStr?.toString().toLowerCase() === 'true',
            isHidden: isHiddenStr?.toString().toLowerCase() === 'y' || 
                      isHiddenStr?.toString() === '1' || 
                      isHiddenStr?.toString().toLowerCase() === 'true',
          };

          const response = await fetch(`${API_URL}/albums`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(albumData),
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error('Error uploading album:', error);
          errorCount++;
        }
      }

      await fetchAlbums();
      toast.success(`${successCount}개 앨범 등록 완료! ${errorCount > 0 ? `${errorCount}개 실패` : ''}`);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('파일 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      // 파일 입력 초기화
      event.target.value = '';
    }
  };

  // CSV 샘플 파일 다운로드
  const downloadSampleCSV = () => {
    const csvContent = `카테고리,앨범제목,아티스트,발매일,유통사명,앨범설명,이미지URL,유튜브URL,추천,숨김
artist,눈의 멜로디,박은빈,2025-12-14,(주)플랜비뮤직,"<p>겨울의 감성을 담은 따뜻한 노래</p><br><p><strong>수록곡</strong></p><ul><li>눈의 멜로디</li></ul>",https://images.unsplash.com/photo-1602424092667-c22e59b2e5af?w=800,https://youtu.be/example1,Y,N
ost,비긴어게인 OST Part.5,플링,2025-11-28,(주)플랜비뮤직,"<p>드라마 비긴어게인 삽입곡</p>",https://images.unsplash.com/photo-1644855640845-ab57a047320e?w=800,https://youtu.be/example2,N,N`;
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '앨범_샘플.csv';
    link.click();
    toast.success('샘플 CSV 파일이 다운로드되었습니다.');
  };

  // 정렬 로직
  const getSortedAlbums = (albums: Album[]) => {
    const sorted = [...albums];
    
    if (sortType === 'featured') {
      // 추천순: 추천 앨범 먼저, 그 다음 날짜 최신순
      return sorted.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        // 둘 다 추천이거나 둘 다 일반이면 날짜순
        const dateA = new Date(a.releaseDate || '1970-01-01').getTime();
        const dateB = new Date(b.releaseDate || '1970-01-01').getTime();
        return dateB - dateA;
      });
    } else if (sortType === 'date-desc') {
      // 최신순
      return sorted.sort((a, b) => {
        const dateA = new Date(a.releaseDate || '1970-01-01').getTime();
        const dateB = new Date(b.releaseDate || '1970-01-01').getTime();
        return dateB - dateA;
      });
    } else {
      // 과거순
      return sorted.sort((a, b) => {
        const dateA = new Date(a.releaseDate || '1970-01-01').getTime();
        const dateB = new Date(b.releaseDate || '1970-01-01').getTime();
        return dateA - dateB;
      });
    }
  };

  const filteredAlbums = albums.filter(album =>
    album.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAlbums = getSortedAlbums(filteredAlbums);

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedIds.size === sortedAlbums.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedAlbums.map(a => a.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">앨범 관리</h1>
          <p className="text-gray-600">음반사별 유통 앨범을 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={downloadSampleCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            CSV 샘플
          </Button>
          <label htmlFor="csv-upload">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => document.getElementById('csv-upload')?.click()}
              disabled={loading}
            >
              <Upload className="w-4 h-4" />
              CSV 일괄등록
            </Button>
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                새 앨범 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingAlbum ? '앨범 수정' : '새 앨범 추가'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">앨범 제목 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="앨범 제목을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist">아티스트 *</Label>
                    <Input
                      id="artist"
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      placeholder="아티스트 이름을 입력하세요"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="releaseDate">발매일 *</Label>
                    <Input
                      id="releaseDate"
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">카테고리</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="artist">아티스트</SelectItem>
                        <SelectItem value="ost">OST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="distributor">유통사명</Label>
                    <Input
                      id="distributor"
                      value={formData.distributor}
                      onChange={(e) => setFormData({ ...formData, distributor: e.target.value })}
                      placeholder="유통사명"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl">이미지 URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="앨범 커버 이미지 URL"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="앨범 미리보기"
                        className="w-32 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200?text=Image+Error';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">앨범 설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="앨범 설명을 입력하세요"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    💡 HTML 태그를 사용할 수 있습니다. 엑셀에서 복사-붙여넣기 시 서식이 그대로 유지됩니다.
                  </p>
                </div>

                <div>
                  <Label htmlFor="youtubeUrl">유튜브 URL</Label>
                  <Input
                    id="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-sm text-gray-500 mt-1">앨범 관련 유튜브 영상이 있으면 입력하세요</p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg border border-purple-200">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <Label htmlFor="isFeatured" className="cursor-pointer">
                      추천 앨범으로 설정
                    </Label>
                    <p className="text-sm text-gray-600">추천 앨범은 왕관 아이콘과 함께 강조 표시됩니다</p>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <EyeOff className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <Label htmlFor="isHidden" className="cursor-pointer">
                      숨김 앨범으로 설정
                    </Label>
                    <p className="text-sm text-gray-600">숨김 앨범은 사용자에게 표시되지 않습니다 (기본: 표시)</p>
                  </div>
                  <Switch
                    id="isHidden"
                    checked={formData.isHidden}
                    onCheckedChange={(checked) => setFormData({ ...formData, isHidden: checked })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                  <Button 
                    onClick={handleSave} 
                    className="bg-gradient-to-r from-cyan-400 to-purple-500"
                    disabled={loading}
                  >
                    {loading ? '저장 중...' : '저장'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search & Sort & Bulk Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-4 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="앨범 또는 아티스트 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={sortType === 'date-desc' ? 'default' : 'outline'}
                onClick={() => setSortType(sortType === 'date-desc' ? 'date-asc' : 'date-desc')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortType === 'date-desc' ? '최신순' : '과거순'}
              </Button>
              <Button
                variant={sortType === 'featured' ? 'default' : 'outline'}
                onClick={() => setSortType('featured')}
                className="flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                추천순
              </Button>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              onClick={toggleSelectAll}
              className="flex items-center gap-2"
            >
              {selectedIds.size === sortedAlbums.length && sortedAlbums.length > 0 ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              전체 선택
            </Button>
            {selectedIds.size > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                선택 항목 삭제 ({selectedIds.size})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Albums Grid */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          {loading && albums.length === 0 ? (
            <div className="p-8 text-center text-gray-500">로딩 중...</div>
          ) : sortedAlbums.length === 0 ? (
            <div className="p-8 text-center text-gray-500">등록된 앨범이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedAlbums.map((album) => (
                <div key={album.id} className="relative group">
                  {/* Checkbox */}
                  <div 
                    className="absolute top-2 left-2 z-10 cursor-pointer"
                    onClick={() => toggleSelect(album.id)}
                  >
                    {selectedIds.has(album.id) ? (
                      <CheckSquare className="w-5 h-5 text-cyan-500 bg-white rounded" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 bg-white/80 rounded" />
                    )}
                  </div>

                  {/* Featured Badge */}
                  {album.isFeatured && (
                    <div className="absolute top-2 right-2 z-10">
                      <Crown className="w-5 h-5 text-yellow-500 drop-shadow-lg" fill="yellow" />
                    </div>
                  )}

                  {/* Hidden Badge */}
                  {album.isHidden && (
                    <div className="absolute top-8 right-2 z-10">
                      <EyeOff className="w-5 h-5 text-gray-500 drop-shadow-lg bg-white/80 rounded-full p-0.5" />
                    </div>
                  )}

                  {/* Album Image */}
                  <div className="relative overflow-hidden rounded-lg shadow-md aspect-square">
                    <img
                      src={album.imageUrl || 'https://via.placeholder.com/300?text=No+Image'}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(album)}
                        className="w-full"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleHidden(album.id, album.isHidden || false)}
                        className="w-full"
                      >
                        {album.isHidden ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                        {album.isHidden ? '표시' : '숨김'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(album.id)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {album.title}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{album.artist}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{album.category || '-'}</Badge>
                      <span className="text-xs text-gray-500">{album.releaseDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}