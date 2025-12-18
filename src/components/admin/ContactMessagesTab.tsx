import { useState, useEffect } from 'react';
import { Mail, Trash2, Check, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export function ContactMessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/contact-messages`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Contact messages loaded:', data.messages);
        setMessages(data.messages || []);
      } else {
        console.error('Failed to fetch contact messages');
        toast.error('메시지 로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast.error('메시지 로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/contact-messages/${id}/read`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, isRead: true } : msg
        ));
        toast.success('읽음으로 표시되었습니다.');
      } else {
        toast.error('읽음 표시에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${API_URL}/contact-messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        toast.success('메시지가 삭제되었습니다.');
      } else {
        toast.error('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\. /g, '-').replace('.', '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">문의 메시지</h1>
        <p className="text-gray-600">Contact 페이지로부터 수신된 메시지를 확인하세요.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">전체 메시지</p>
                <p className="text-3xl font-bold">{messages.length}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Mail className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">읽지 않음</p>
                <p className="text-3xl font-bold">{unreadCount}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">읽음</p>
                <p className="text-3xl font-bold">{messages.length - unreadCount}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Check className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>메시지 목록</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-8 text-gray-500">로딩 중...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>아직 문의 메시지가 없습니다.</p>
              </div>
            ) : (
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.isRead) {
                        handleMarkAsRead(message.id);
                      }
                    }}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className={`${message.isRead ? '' : 'font-bold'}`}>
                          {message.name}
                        </h4>
                        {!message.isRead && (
                          <Badge className="bg-red-500">NEW</Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{message.subject}</p>
                    <p className="text-sm text-gray-500 truncate">{message.message}</p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>메시지 상세</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">보낸이</label>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">이메일</label>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">연락처</label>
                  <p className="font-medium">{selectedMessage.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">제목</label>
                  <p className="font-medium">{selectedMessage.subject}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">메시지</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">수신 일시</label>
                  <p className="font-medium">{formatDate(selectedMessage.createdAt)}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    답장하기
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                    삭제
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>메시지를 선택하세요</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}