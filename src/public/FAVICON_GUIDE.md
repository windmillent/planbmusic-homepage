# 파비콘 및 OG 이미지 가이드

## 필요한 파일 목록

웹사이트가 모든 브라우저와 플랫폼에서 올바르게 표시되려면 다음 파일들이 `/public` 폴더에 있어야 합니다:

### 1. 파비콘 파일들
- `favicon.ico` - 16x16, 32x32, 48x48 크기 포함 (가장 중요!)
- `favicon-16x16.png` - 16x16 PNG
- `favicon-32x32.png` - 32x32 PNG
- `apple-touch-icon.png` - 180x180 PNG (iOS용)
- `android-chrome-192x192.png` - 192x192 PNG (안드로이드용)
- `android-chrome-512x512.png` - 512x512 PNG (안드로이드용)

### 2. OG 이미지
- `og-image.png` - 1200x630 PNG (소셜 미디어 공유용)

## 파비콘 생성 방법

### 온라인 도구 사용 (추천)
1. https://realfavicongenerator.net/ 방문
2. 원본 이미지(최소 512x512) 업로드
3. 모든 플랫폼용 파비콘 자동 생성
4. 생성된 파일들을 `/public` 폴더에 복사

### 또는 https://favicon.io/ 사용
- 텍스트, 이미지, 또는 이모지로 파비콘 생성 가능

## 디자인 가이드

### PLANB MUSIC 파비콘 디자인
- **배경**: 보라색 원형 (#8b5cf6)
- **아이콘**: 흰색 물결무늬 또는 음표
- **스타일**: 단순하고 깔끔한 디자인

### OG 이미지 디자인
- **크기**: 1200x630px
- **배경**: 청록색→보라색 그라데이션
- **텍스트**: "PLANB MUSIC" + "Music Distribution Platform"
- **폰트**: Pretendard

## 파일 생성 후 해야 할 일

1. 모든 파일을 `/public` 폴더에 저장
2. Git에 커밋 & 푸시
3. Vercel 자동 배포 확인
4. 브라우저 캐시 삭제 (Ctrl+Shift+R 또는 Cmd+Shift+R)
5. 여러 브라우저에서 테스트

## 문제 해결

### 파비콘이 안 보이는 경우
1. **브라우저 캐시 삭제**: 하드 새로고침 (Ctrl+Shift+R)
2. **시크릿 모드**에서 확인
3. **다른 브라우저**에서 테스트
4. **배포 확인**: Vercel에서 파일이 올바르게 배포되었는지 확인

### OG 이미지가 안 보이는 경우
1. Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
2. Twitter Card Validator: https://cards-dev.twitter.com/validator
3. URL에 `https://www.planbmusic.co.kr/og-image.png` 직접 접근하여 확인

## 현재 상태

- ✅ index.html에 모든 파비콘 링크 추가됨
- ✅ site.webmanifest 생성됨
- ⚠️ 실제 파비콘 이미지 파일들이 필요함

## 다음 단계

1. 온라인 파비콘 생성기로 모든 크기의 파비콘 생성
2. 생성된 파일들을 `/public` 폴더에 복사
3. GitHub에 푸시
4. 배포 후 확인
