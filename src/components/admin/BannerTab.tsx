import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, Info, Monitor, Smartphone } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageType?: 'url' | 'upload';
  desktopWidth?: number;
  desktopHeight?: number;
  mobileWidth?: number;
  mobileHeight?: number;
  textColor?: string;
  backgroundColor?: string;
  buttonText?: string;
  buttonLink?: string;
  link?: string;
  isActive: boolean;
  priority?: number;
  position: 'albums';
  createdAt?: string;
  updatedAt?: string;
}

export function BannerTab() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageType, setImageType] = useState<'url' | 'upload'>('url');
  const [sizeType, setSizeType] = useState<'desktop' | 'mobile'>('desktop');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    imageType: 'url' as 'url' | 'upload',
    desktopWidth: 1920,
    desktopHeight: 600,
    mobileWidth: 768,
    mobileHeight: 400,
    textColor: '#ffffff',
    backgroundColor: '#000000',
    buttonText: '자세히 보기',
    buttonLink: '',
    link: '',
    priority: 1,
    position: 'albums' as 'albums',
  });

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

  // Fetch banners from Supabase
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/banners`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      const data = await response.json();
      console.log('All banners from server:', data.banners);
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('배너 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.imageUrl) {
      toast.error('제목과 이미지는 필수 입력 항목입니다.');
      return;
    }

    try {
      setLoading(true);
      if (editingBanner) {
        // Update existing banner
        console.log('📝 Updating banner:', editingBanner.id, formData);
        const response = await fetch(`${API_URL}/banners/${editingBanner.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            isActive: editingBanner.isActive,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to update banner');
        }
        const result = await response.json();
        console.log('✅ Banner updated:', result);
        toast.success('배너가 수정되었습니다.');
      } else {
        // Create new banner
        console.log('➕ Creating new banner:', formData);
        const response = await fetch(`${API_URL}/banners`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            isActive: false,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to create banner');
        }
        const result = await response.json();
        console.log('✅ Banner created:', result);
        toast.success('새 배너가 추가되었습니다.');
      }
      await fetchBanners();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('❌ Error saving banner:', error);
      toast.error('배너 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setImageType(banner.imageType || 'url');
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl,
      imageType: banner.imageType || 'url',
      desktopWidth: banner.desktopWidth || 1920,
      desktopHeight: banner.desktopHeight || 600,
      mobileWidth: banner.mobileWidth || 768,
      mobileHeight: banner.mobileHeight || 400,
      textColor: banner.textColor || '#ffffff',
      backgroundColor: banner.backgroundColor || '#000000',
      buttonText: banner.buttonText || '자세히 보기',
      buttonLink: banner.buttonLink || banner.link || '',
      link: banner.link || '',
      priority: banner.priority || 1,
      position: banner.position,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }
      toast.success('배너가 삭제되었습니다.');
      await fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('배너 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentActive,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle banner');
      }
      toast.success('배너 상태가 변경되었습니다.');
      await fetchBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
      toast.error('배너 상태 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      imageType: 'url',
      desktopWidth: 1920,
      desktopHeight: 600,
      mobileWidth: 768,
      mobileHeight: 400,
      textColor: '#ffffff',
      backgroundColor: '#000000',
      buttonText: '자세히 보기',
      buttonLink: '',
      link: '',
      priority: 1,
      position: 'albums',
    });
    setImageType('url');
    setEditingBanner(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">배너 관리</h1>
          <p className="text-gray-600">Albums 페이지 배너를 관리합니다. 활성화된 배너가 있으면 Albums 페이지 상단에 표시됩니다.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600"
              onClick={resetForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              새 배너 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 배너 추가</DialogTitle>
              <DialogDescription>Albums 페이지에 표시될 배너를 추가합니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium">제목</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="배너 제목"
                  className="mt-1"
                />
              </div>

              {/* 부제목 */}
              <div>
                <Label htmlFor="subtitle" className="text-sm font-medium">부제목</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="배너 부제목"
                  className="mt-1"
                />
              </div>

              {/* 배경 이미지 */}
              <div>
                <Label className="text-sm font-medium text-orange-600">배경 이미지</Label>
                
                {/* 배너 이미지 권장 사이즈 안내 */}
                <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-2">배너 이미지 권장 사이즈</p>
                      <div className="space-y-1 text-blue-700">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          <span className="font-medium">데스크톱 (권장):</span>
                          <span>1920×600px (1.92:1 비율)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          <span className="font-medium">모바일 (권장):</span>
                          <span>768×400px (1.92:1 비율)</span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-blue-600">
                        ※ 파일 크기: 최대 2MB, 형식: JPG, PNG, WebP 권장<br/>
                        ※ 텍스트가 잘 보이도록 명암 대비가 확실한 이미지를 사용하세요
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    variant={imageType === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setImageType('url');
                      setFormData({ ...formData, imageType: 'url' });
                    }}
                  >
                    URL
                  </Button>
                  <Button
                    type="button"
                    variant={imageType === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setImageType('upload');
                      setFormData({ ...formData, imageType: 'upload' });
                    }}
                  >
                    파일 업로드
                  </Button>
                </div>
                
                {imageType === 'url' ? (
                  <div className="mt-2">
                    <Label className="text-xs text-gray-500">또는 이미지 URL 직접 입력</Label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/banner-image.jpg"
                      className="mt-1"
                    />
                    <div className="flex gap-2 items-center mt-2">
                      <Button variant="outline" size="sm" type="button">
                        <Upload className="w-4 h-4 mr-1" />
                        파일 선택
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-gray-400 mb-2">📁</div>
                    <p className="text-sm text-gray-600 mb-2">이미지를 드래그하여 놓거나 클릭하여 선택하세요</p>
                    <p className="text-xs text-gray-500">권장: 1920×600px, 최대 2MB, JPG, PNG, WebP</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, imageUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="mt-2"
                    />
                  </div>
                )}

                {formData.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.imageUrl}
                      alt="미리보기"
                      className="w-full rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/1920x600?text=Image+Error';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 텍스트 색상 & 배경 색상 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">텍스트 색상</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="flex-1 relative">
                      <Input
                        type="color"
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="h-10 cursor-pointer"
                      />
                    </div>
                    <Input
                      value={formData.textColor}
                      onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                      placeholder="#ffffff"
                      className="w-24"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">배경 색상</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="flex-1 relative">
                      <Input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                        className="h-10 cursor-pointer"
                      />
                    </div>
                    <Input
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      placeholder="#000000"
                      className="w-24"
                    />
                  </div>
                </div>
              </div>

              {/* 버튼 텍스트 */}
              <div>
                <Label htmlFor="buttonText" className="text-sm font-medium">버튼 텍스트</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="자세히 보기"
                  className="mt-1"
                />
              </div>

              {/* 버튼 링크 */}
              <div>
                <Label htmlFor="buttonLink" className="text-sm font-medium">버튼 링크</Label>
                <Input
                  id="buttonLink"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value, link: e.target.value })}
                  placeholder="https://example.com"
                  className="mt-1"
                />
              </div>

              {/* 활성화 및 우선순위 */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    checked={editingBanner?.isActive || false}
                    onCheckedChange={(checked) => {
                      if (editingBanner) {
                        setEditingBanner({ ...editingBanner, isActive: checked });
                      }
                    }}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">활성화</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="priority" className="text-sm">우선순위</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    className="w-16"
                    min="1"
                  />
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end gap-2 pt-4">
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

      {/* Banners Grid */}
      {loading && banners.length === 0 ? (
        <div className="p-8 text-center text-gray-500">로딩 중...</div>
      ) : banners.length === 0 ? (
        <div className="p-8 text-center text-gray-500">등록된 배너가 없습니다.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <Card key={banner.id} className="border-0 shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                {banner.title && (
                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4">
                    <h3 className="text-white text-2xl font-bold text-center">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-white/90 text-sm mt-1">{banner.subtitle}</p>
                    )}
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleActive(banner.id, banner.isActive)}
                    disabled={loading}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      banner.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {banner.isActive ? (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> 활성
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> 비활성
                      </span>
                    )}
                  </button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold mb-1">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-sm text-gray-600 mb-1">{banner.subtitle}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      위치: Albums 페이지 {banner.priority && `(우선순위: ${banner.priority})`}
                    </p>
                    {(banner.buttonLink || banner.link) && (
                      <p className="text-sm text-blue-600 truncate">
                        링크: {banner.buttonLink || banner.link}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(banner)} className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    수정
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(banner.id)} className="flex-1">
                    <Trash2 className="w-4 h-4 mr-1 text-red-500" />
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}