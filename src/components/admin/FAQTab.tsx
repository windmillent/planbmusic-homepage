import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export function FAQTab() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '발매문의',
    question: '',
    answer: '',
    order: 0,
    isHidden: false,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/faqs?showHidden=true`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFaqs(data.faqs || []);
      } else {
        toast.error('FAQ 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('FAQ 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    if (!confirm('FAQ를 초기화하시겠습니까? 이미 데이터가 있으면 추가되지 않습니다.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/faqs/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'FAQ가 초기화되었습니다.');
        fetchFAQs();
      } else {
        toast.error(data.error || 'FAQ 초기화에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error initializing FAQs:', error);
      toast.error('FAQ 초기화 중 오류가 발생했습니다.');
    }
  };

  const handleCreate = async () => {
    if (!formData.question || !formData.answer) {
      toast.error('질문과 답변을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('FAQ가 추가되었습니다.');
        setShowNewForm(false);
        setFormData({
          category: '발매문의',
          question: '',
          answer: '',
          order: 0,
          isHidden: false,
        });
        fetchFAQs();
      } else {
        const data = await response.json();
        toast.error(data.error || 'FAQ 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating FAQ:', error);
      toast.error('FAQ 추가 중 오류가 발생했습니다.');
    }
  };

  const handleUpdate = async (faq: FAQ) => {
    try {
      const response = await fetch(`${API_URL}/faqs/${faq.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          category: faq.category,
          question: faq.question,
          answer: faq.answer,
          order: faq.order,
          isHidden: faq.isHidden,
        }),
      });

      if (response.ok) {
        toast.success('FAQ가 수정되었습니다.');
        setEditingId(null);
        fetchFAQs();
      } else {
        const data = await response.json();
        toast.error(data.error || 'FAQ 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast.error('FAQ 수정 중 오류가 발생했습니다.');
    }
  };

  const handleToggleVisibility = async (faq: FAQ) => {
    try {
      const response = await fetch(`${API_URL}/faqs/${faq.id}/toggle-visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        toast.success(faq.isHidden ? 'FAQ가 표시됩니다.' : 'FAQ가 숨겨집니다.');
        fetchFAQs();
      } else {
        const data = await response.json();
        toast.error(data.error || 'FAQ 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error toggling FAQ visibility:', error);
      toast.error('FAQ 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 FAQ를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/faqs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        toast.success('FAQ가 삭제되었습니다.');
        fetchFAQs();
      } else {
        const data = await response.json();
        toast.error(data.error || 'FAQ 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('FAQ 삭제 중 오류가 발생했습니다.');
    }
  };

  const updateFAQ = (id: string, field: keyof FAQ, value: string | number | boolean) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const categories = Object.keys(groupedFaqs);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">FAQ를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">FAQ 관리</h1>
        <Button onClick={() => setShowNewForm(true)} className="bg-gradient-to-r from-cyan-400 to-purple-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          FAQ 추가
        </Button>
      </div>

      {/* New FAQ Form */}
      {showNewForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-purple-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">새 FAQ 추가</h3>
            <button onClick={() => setShowNewForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">카테고리</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="발매문의">발매문의</option>
                <option value="정산 문의">정산 문의</option>
                <option value="프로모션 / 기타 문의">프로모션 / 기타 문의</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">질문</label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="질문을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">답변</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg min-h-[150px]"
                placeholder="답변을 입력하세요 (줄바꿈은 자동으로 적용됩니다)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">정렬 순서</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isHidden}
                    onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">숨김</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                취소
              </Button>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-cyan-400 to-purple-600 text-white">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-6">
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">등록된 FAQ가 없습니다.</p>
            <Button onClick={handleInitialize} variant="outline">
              FAQ 초기화
            </Button>
          </div>
        ) : (
          categories.map((category) => {
            const categoryFaqs = groupedFaqs[category];
            
            return (
              <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-6 py-3">
                  <h2 className="font-bold text-lg">{category}</h2>
                </div>

                <div className="divide-y">
                  {categoryFaqs.map((faq) => (
                    <div 
                      key={faq.id} 
                      className={`p-4 ${faq.isHidden ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      {editingId === faq.id ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">카테고리</label>
                            <select
                              value={faq.category}
                              onChange={(e) => updateFAQ(faq.id, 'category', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg"
                            >
                              <option value="발매문의">발매문의</option>
                              <option value="정산 문의">정산 문의</option>
                              <option value="프로모션 / 기타 문의">프로모션 / 기타 문의</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">질문</label>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">답변</label>
                            <textarea
                              value={faq.answer}
                              onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg min-h-[150px]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">정렬 순서</label>
                              <input
                                type="number"
                                value={faq.order}
                                onChange={(e) => updateFAQ(faq.id, 'order', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border rounded-lg"
                              />
                            </div>

                            <div className="flex items-end">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={faq.isHidden}
                                  onChange={(e) => updateFAQ(faq.id, 'isHidden', e.target.checked)}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm font-medium">숨김</span>
                              </label>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditingId(null)}>
                              취소
                            </Button>
                            <Button 
                              onClick={() => handleUpdate(faq)} 
                              className="bg-gradient-to-r from-cyan-400 to-purple-600 text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              저장
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                  순서: {faq.order}
                                </span>
                                {faq.isHidden && (
                                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
                                    <EyeOff className="w-3 h-3" />
                                    숨김
                                  </span>
                                )}
                              </div>
                              <h3 className="font-bold text-gray-900">{faq.question}</h3>
                            </div>

                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleVisibility(faq)}
                                title={faq.isHidden ? '표시' : '숨김'}
                              >
                                {faq.isHidden ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingId(faq.id)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(faq.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-gray-600 whitespace-pre-line text-sm">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}