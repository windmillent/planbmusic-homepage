import { useState, useEffect } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2, Database } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface RestoreStats {
  albums: number;
  youtube_videos: number;
  videos: number;
  admins: number;
  faqs: number;
  popups: number;
}

export function RestoreTab() {
  const [file, setFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<RestoreStats | null>(null);

  // 컴포넌트 마운트 확인
  useEffect(() => {
    console.log('✅ RestoreTab 컴포넌트가 마운트되었습니다!');
    toast.info('데이터 복원 탭이 로드되었습니다.');
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📂 파일 선택 대화상자 열림');
    const selectedFile = e.target.files?.[0];
    console.log('📁 선택된 파일:', selectedFile);
    
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      setError(null);
      setIsComplete(false);
      toast.success(`파일 선택됨: ${selectedFile.name}`);
      console.log('✅ JSON 파일 선택 완료:', selectedFile.name);
    } else if (selectedFile) {
      const errorMsg = 'JSON 파일만 업로드 가능합니다.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('❌ 잘못된 파일 형식:', selectedFile.type);
    }
  };

  const handleRestore = async () => {
    console.log('🚀 복원 시작! 버튼 클릭됨');
    
    if (!file) {
      console.error('⚠️ 파일이 선택되지 않음');
      setError('파일을 선택해주세요.');
      toast.error('파일을 먼저 선택해주세요.');
      return;
    }

    console.log('📁 선택된 파일:', file.name, file.type, file.size);
    toast.info('복원을 시작합니다...');

    setIsRestoring(true);
    setProgress(0);
    setError(null);
    setIsComplete(false);

    try {
      // Read file content
      const fileContent = await file.text();
      console.log('📄 파일 읽기 완료, 크기:', fileContent.length);
      
      const backupData = JSON.parse(fileContent);
      console.log('📦 백업 파일 내용:', backupData);

      if (!backupData.data) {
        throw new Error('잘못된 백업 파일 형식입니다.');
      }

      setCurrentStep('서버로 데이터 전송 중...');
      setProgress(10);

      // Get admin token from localStorage
      const token = localStorage.getItem('admin_token');
      console.log('🔑 관리자 토큰:', token ? '있음' : '없음');

      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0/restore`;
      console.log('📡 API URL:', apiUrl);

      // Send to server API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || publicAnonKey}`,
        },
        body: JSON.stringify(backupData),
      });

      console.log('📨 서버 응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ 서버 오류:', errorData);
        throw new Error(errorData.error || '복원 중 오류가 발생했습니다.');
      }

      const result = await response.json();
      console.log('✅ 복원 결과:', result);
      
      setProgress(100);
      setStats(result.stats);
      setCurrentStep('복원 완료!');
      setIsComplete(true);
      toast.success('데이터가 성공적으로 복원되었습니다.');
    } catch (err: any) {
      console.error('🔥 Restore error:', err);
      setError(err.message || '복원 중 오류가 발생했습니다.');
      toast.error(`데이터 복원 실패: ${err.message}`);
    } finally {
      setIsRestoring(false);
      console.log('🏁 복원 프로세스 종료');
    }
  };

  const handleReset = () => {
    setFile(null);
    setIsComplete(false);
    setError(null);
    setStats(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">🔄 데이터 복원</h2>
        <p className="text-gray-600">
          백업 파일(JSON)을 업로드하여 데이터베이스를 복원합니다.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            백업 파일 복원
          </CardTitle>
          <CardDescription>
            planbmusic-backup-*.json 형식의 백업 파일을 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isComplete && !isRestoring && (
            <>
              {/* 파일 선택 버튼 - 더 명확하게 */}
              <div className="space-y-4">
                <label htmlFor="file-upload">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <span className="text-sm text-gray-600 font-medium block mb-2">
                      {file ? `✅ ${file.name}` : '📁 JSON 파일을 선택하세요'}
                    </span>
                    <p className="text-xs text-gray-500">
                      이 영역을 클릭하여 파일 선택
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                    onClick={(e) => {
                      console.log('🖱️ 파일 입력 클릭됨');
                      // Reset input to allow selecting the same file again
                      e.currentTarget.value = '';
                    }}
                  />
                </label>

                {/* 또는 버튼 형태로도 선택 가능 */}
                <div className="text-center">
                  <Button
                    onClick={() => {
                      console.log('🖱️ 파일 선택 버튼 클릭됨');
                      document.getElementById('file-upload')?.click();
                    }}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {file ? '다른 파일 선택' : '파일 선택하기'}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleRestore}
                  disabled={!file || isRestoring}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {file ? '복원 시작' : '파일을 먼저 선택하세요'}
                </Button>
                {file && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                  >
                    취소
                  </Button>
                )}
              </div>
            </>
          )}

          {isRestoring && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                <span className="text-sm font-medium">{currentStep}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-center text-sm text-gray-500">
                {Math.round(progress)}% 완료
              </p>
            </div>
          )}

          {isComplete && stats && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle2 className="h-8 w-8" />
                <span className="text-xl font-bold">복원 완료!</span>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <h3 className="font-semibold mb-4 text-green-800 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  복원된 데이터:
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span>📀</span>
                    <span>앨범:</span>
                  </div>
                  <div className="font-mono font-bold text-green-700">{stats.albums || 0}개</div>
                  
                  <div className="flex items-center gap-2">
                    <span>🎬</span>
                    <span>유튜브 영상:</span>
                  </div>
                  <div className="font-mono font-bold text-green-700">{(stats.youtube_videos || stats.videos || 0)}개</div>
                  
                  <div className="flex items-center gap-2">
                    <span>❓</span>
                    <span>FAQ:</span>
                  </div>
                  <div className="font-mono font-bold text-green-700">{stats.faqs || 0}개</div>
                  
                  <div className="flex items-center gap-2">
                    <span>📢</span>
                    <span>팝업:</span>
                  </div>
                  <div className="font-mono font-bold text-green-700">{stats.popups || 0}개</div>
                </div>
              </div>

              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  모든 데이터가 성공적으로 복원되었습니다. 이제 다른 탭에서 데이터를 확인할 수 있습니다!
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                size="lg"
              >
                새로운 파일 복원
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 주의사항 */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 text-lg">⚠️ 주의사항</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-900 space-y-2">
          <p>• 복원 작업은 기존 데이터를 덮어쓰지 않고 추가합니다.</p>
          <p>• 중복된 데이터가 생성될 수 있으니 주의하세요.</p>
          <p>• 백업 파일 형식이 올바른지 확인하세요.</p>
          <p>• 복원 중에는 브라우저를 닫지 마세요.</p>
        </CardContent>
      </Card>
    </div>
  );
}
