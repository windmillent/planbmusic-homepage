import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface Popup {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageType?: 'url' | 'upload';
  linkUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  showDetails?: boolean;
  isActive: boolean;
  createdAt?: string;
}

export function PopupsTab() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageType, setImageType] = useState<'url' | 'upload'>('url');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    imageType: 'url' as 'url' | 'upload',
    buttonText: '',
    buttonLink: '',
    showDetails: false,
    isActive: true,
  });

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

  const fetchPopups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/popups`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch popups');
      }
      const data = await response.json();
      setPopups(data.popups || []);
    } catch (error) {
      console.error('Error fetching popups:', error);
      toast.error('팝업 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.imageUrl) {
      toast.error('제목과 이미지는 필수 입력 항목입니다.');
      return;
    }

    try {
      setLoading(true);
      if (editingPopup) {
        const response = await fetch(`${API_URL}/popups/${editingPopup.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to update popup');
        }
        toast.success('팝업이 수정되었습니다.');
      } else {
        const response = await fetch(`${API_URL}/popups`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to create popup');
        }
        toast.success('새 팝업이 추가되었습니다.');
      }
      await fetchPopups();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving popup:', error);
      toast.error('팝업 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (popup: Popup) => {
    setEditingPopup(popup);
    setImageType(popup.imageType || 'url');
    setFormData({
      title: popup.title,
      description: popup.description || '',
      imageUrl: popup.imageUrl,
      imageType: popup.imageType || 'url',
      buttonText: popup.buttonText || '',
      buttonLink: popup.buttonLink || '',
      showDetails: popup.showDetails || false,
      isActive: popup.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/popups/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete popup');
      }
      toast.success('팝업이 삭제되었습니다.');
      await fetchPopups();
    } catch (error) {
      console.error('Error deleting popup:', error);
      toast.error('팝업 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/popups/${id}`, {
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
        throw new Error('Failed to toggle popup');
      }
      toast.success(currentActive ? '팝업이 비활성화되었습니다.' : '팝업이 활성화되었습니다.');
      await fetchPopups();
    } catch (error) {
      console.error('Error toggling popup:', error);
      toast.error('팝업 상태 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      imageType: 'url',
      buttonText: '',
      buttonLink: '',
      showDetails: false,
      isActive: true,
    });
    setImageType('url');
    setEditingPopup(null);
  };

  const activePopups = popups.filter(p => p.isActive);
  const inactivePopups = popups.filter(p => !p.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">팝업 관리</h1>
          <p className="text-gray-600">메인 화면에 표시될 팝업을 관리합니다. 앨범 광고, 공지사항 등을 추가할 수 있습니다.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600"
              onClick={resetForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              새 팝업 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-purple-600">📢</span>
                {editingPopup ? '팝업 수정' : '새 팝업 추가'}
              </DialogTitle>
              <DialogDescription>
                팝업을 추가하거나 수정할 수 있습니다. 이미지 URL을 입력하거나 파일을 업로드하여 팝업 이미지를 설정할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* 팝업 제목 */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium">팝업 제목 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="팝업 제목을 입력하세요"
                  className="mt-1"
                />
              </div>

              {/* 팝업 설명 */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium">팝업 설명 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="팝업에 표시될 설명을 입력하세요"
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* 팝업 이미지 */}
              <div>
                <Label className="text-sm font-medium">팝업 이미지</Label>
                <div className="mt-2 flex gap-2">
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
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="팝업 이미지 URL을 입력하세요"
                    className="mt-2"
                  />
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
                  <div className="mt-3 max-w-xs">
                    <img
                      src={formData.imageUrl}
                      alt="미리보기"
                      className="w-full rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Image+Error';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 버튼 링크 */}
              <div>
                <Label htmlFor="buttonLink" className="text-sm font-medium">버튼 링크</Label>
                <Input
                  id="buttonLink"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="버튼 클릭 시 이동할 URL (선택사항)"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">예: https://youtu.be/P8wK0QVEg</p>
              </div>

              {/* 버튼 텍스트 */}
              <div>
                <Label htmlFor="buttonText" className="text-sm font-medium">버튼 텍스트</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="예: 감상하기, 자세히 보기"
                  className="mt-1"
                />
              </div>

              {/* 토글 옵션 */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <Label htmlFor="showDetails" className="cursor-pointer">연결 상세 정보 표시</Label>
                  </div>
                  <Switch
                    id="showDetails"
                    checked={formData.showDetails}
                    onCheckedChange={(checked) => setFormData({ ...formData, showDetails: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <Label htmlFor="isActive" className="cursor-pointer">단순 활성화</Label>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                <Button 
                  onClick={handleSave} 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={loading}
                >
                  {loading ? '저장 중...' : '추가하기'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">총 팝업 수</p>
                <p className="text-3xl font-bold">{popups.length}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-2xl">📢</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">활성 팝업</p>
                <p className="text-3xl font-bold text-green-600">{activePopups.length}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Eye className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">비활성 팝업</p>
                <p className="text-3xl font-bold text-gray-400">{inactivePopups.length}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                <EyeOff className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popups Grid */}
      {loading && popups.length === 0 ? (
        <div className="p-8 text-center text-gray-500">로딩 중...</div>
      ) : popups.length === 0 ? (
        <div className="p-8 text-center text-gray-500">등록된 팝업이 없습니다.</div>
      ) : (
        <div className="space-y-6">
          {/* Active Popups */}
          {activePopups.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                활성 팝업 ({activePopups.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activePopups.map((popup) => (
                  <Card key={popup.id} className="border-0 shadow-lg overflow-hidden">
                    <div className="relative">
                      <img
                        src={popup.imageUrl}
                        alt={popup.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/320x500?text=Image+Error';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-bold">
                          활성
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-1">{popup.title}</h3>
                      {popup.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{popup.description}</p>
                      )}
                      {popup.buttonLink && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                          <LinkIcon className="w-3 h-3" />
                          <span className="truncate">{popup.buttonText || '링크'}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleActive(popup.id, popup.isActive)}
                          className="flex-1"
                          disabled={loading}
                        >
                          <EyeOff className="w-4 h-4 mr-1" />
                          비활성화
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(popup)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(popup.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Inactive Popups */}
          {inactivePopups.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-gray-400" />
                비활성 팝업 ({inactivePopups.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {inactivePopups.map((popup) => (
                  <Card key={popup.id} className="border-0 shadow-lg overflow-hidden opacity-60">
                    <div className="relative">
                      <img
                        src={popup.imageUrl}
                        alt={popup.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/320x500?text=Image+Error';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-gray-500 text-white rounded text-xs font-bold">
                          비활성
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-1">{popup.title}</h3>
                      {popup.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{popup.description}</p>
                      )}
                      {popup.buttonLink && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                          <LinkIcon className="w-3 h-3" />
                          <span className="truncate">{popup.buttonText || '링크'}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleActive(popup.id, popup.isActive)}
                          className="flex-1"
                          disabled={loading}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          활성화
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(popup)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(popup.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}