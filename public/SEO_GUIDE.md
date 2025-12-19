# PLANB MUSIC - SEO 및 검색 엔진 등록 가이드

## 🎯 완료된 SEO 최적화 항목

### ✅ 1. 메타 태그 최적화
- **Title**: "PLANB MUSIC - 음악 배급 플랫폼 | 음원 유통 서비스"
- **Description**: 상세한 서비스 설명 포함
- **Keywords**: 플랜비뮤직, 음원 유통, 음악 배급 등 주요 검색어 포함
- **OG Tags**: Facebook, 카카오톡 공유 최적화
- **Twitter Cards**: 트위터 공유 최적화
- **Structured Data (JSON-LD)**: Google 검색 최적화

### ✅ 2. 파일 생성 완료
- `robots.txt` - 검색 엔진 크롤러 안내
- `sitemap.xml` - 사이트 구조 정보
- `site.webmanifest` - PWA 지원

### ✅ 3. 파비콘 설정
- 다양한 크기 지원 (16x16, 32x32, 96x96, 180x180)
- .ico, .svg, .png 형식 지원

---

## 📝 검색 엔진 등록 가이드

### 1. Google Search Console
**등록 URL**: https://search.google.com/search-console

#### 등록 절차:
1. Google Search Console 접속 후 로그인
2. "속성 추가" 클릭
3. **URL**: `https://www.planbmusic.co.kr` 입력
4. **소유권 확인 방법 선택**:
   - **권장**: HTML 태그 (이미 index.html에 준비됨)
   - 또는 도메인 DNS 레코드 추가

5. **sitemap 제출**:
   ```
   https://www.planbmusic.co.kr/sitemap.xml
   ```

6. **URL 검사 도구**로 주요 페이지 색인 요청:
   - https://www.planbmusic.co.kr/
   - https://www.planbmusic.co.kr/albums
   - https://www.planbmusic.co.kr/about
   - https://www.planbmusic.co.kr/contact

#### HTML 태그 추가 (필요시):
```html
<meta name="google-site-verification" content="발급받은코드" />
```

---

### 2. Naver Search Advisor (네이버 웹마스터 도구)
**등록 URL**: https://searchadvisor.naver.com/

#### 등록 절차:
1. 네이버 웹마스터 도구 접속 후 로그인
2. "사이트 등록" 클릭
3. **URL**: `https://www.planbmusic.co.kr` 입력
4. **소유권 확인**:
   - HTML 태그 선택
   - 발급받은 메타 태그를 index.html에 추가:
   ```html
   <meta name="naver-site-verification" content="발급받은코드" />
   ```

5. **사이트맵 제출**:
   ```
   https://www.planbmusic.co.kr/sitemap.xml
   ```

6. **RSS 제출** (선택사항):
   - 블로그나 뉴스가 있는 경우

#### 추가 최적화:
- **검색 결과 노출 설정**: 사이트 설명 최적화
- **대표 이미지 설정**: og-image.png 사용

---

### 3. Daum 검색 등록
**등록 URL**: https://register.search.daum.net/index.daum

#### 등록 절차:
1. Daum 검색 등록 페이지 접속
2. **사이트 URL**: `https://www.planbmusic.co.kr` 입력
3. **사이트 설명**: 음원 발매부터 정산까지, 창작자와 함께하는 음악 배급 플랫폼
4. **카테고리**: 엔터테인먼트 > 음악 > 음원 유통
5. 제출

---

### 4. Bing Webmaster Tools
**등록 URL**: https://www.bing.com/webmasters

#### 등록 절차:
1. Bing Webmaster Tools 접속
2. "사이트 추가" 클릭
3. **Google Search Console 연동** 옵션 사용 (가장 간편)
4. 또는 수동으로 URL 입력 및 소유권 확인

---

## 🔍 주요 검색 키워드

### 핵심 키워드:
- 플랜비뮤직
- PLANB MUSIC
- 음원 유통
- 음악 배급
- 디지털 음원 유통

### 롱테일 키워드:
- 음원 유통 플랫폼
- 인디 음악 유통
- 음원 발매 대행
- 음원 정산
- 멜론 음원 유통
- 스포티파이 음원 등록
- OST 음원 배급

---

## 📊 성과 측정

### Google Analytics 설정 (권장)
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Naver Analytics 설정 (권장)
한국 사용자 분석을 위해 네이버 애널리틱스 추가 고려

---

## ✅ 체크리스트

배포 후 확인사항:

- [ ] Google Search Console 등록 완료
- [ ] Naver Search Advisor 등록 완료
- [ ] Sitemap 제출 완료 (Google, Naver)
- [ ] robots.txt 접근 확인: https://www.planbmusic.co.kr/robots.txt
- [ ] sitemap.xml 접근 확인: https://www.planbmusic.co.kr/sitemap.xml
- [ ] OG 이미지 확인: https://www.planbmusic.co.kr/og-image.png
- [ ] 파비콘 확인 (브라우저 캐시 삭제 후)
- [ ] 모바일 친화성 테스트: https://search.google.com/test/mobile-friendly
- [ ] 페이지 속도 테스트: https://pagespeed.web.dev/

---

## 🚀 추가 최적화 팁

1. **콘텐츠 정기 업데이트**
   - Albums 페이지에 신규 앨범 정기 등록
   - Media 페이지에 유튜브 영상 업데이트
   - FAQ 정기 업데이트

2. **백링크 구축**
   - 음악 관련 커뮤니티에 홍보
   - SNS 채널 운영 (Instagram, YouTube, Facebook)
   - 아티스트 페이지에 배급사 링크 요청

3. **로컬 SEO**
   - Google My Business 등록 (실제 사무실 있는 경우)
   - 지역 기반 키워드 활용

4. **기술적 SEO**
   - HTTPS 사용 (이미 적용됨)
   - 페이지 로딩 속도 최적화
   - 모바일 반응형 디자인 (이미 적용됨)

---

## 📞 문제 해결

### 검색에 노출되지 않는 경우:
1. **대기 시간**: 일반적으로 1-4주 소요
2. **robots.txt 확인**: 차단 설정 여부 확인
3. **색인 상태 확인**: Google Search Console에서 확인
4. **수동 색인 요청**: URL 검사 도구 사용

### 파비콘이 보이지 않는 경우:
1. **브라우저 캐시 삭제**: Ctrl+Shift+R (하드 새로고침)
2. **시크릿 모드 테스트**
3. **배포 확인**: Vercel에서 파일 업로드 확인
4. **파일 경로 확인**: /public 폴더에 위치

---

마지막 업데이트: 2024-12-19
