import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-097ccdc0/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ ALBUMS ROUTES ============

// Get all albums (sorted by release date, newest first)
app.get("/make-server-097ccdc0/albums", async (c) => {
  try {
    const albums = await kv.getByPrefix("album:");
    // Sort by releaseDate descending (newest first)
    const sortedAlbums = albums.sort((a, b) => {
      const dateA = new Date(a.releaseDate || '1970-01-01').getTime();
      const dateB = new Date(b.releaseDate || '1970-01-01').getTime();
      return dateB - dateA;
    });
    return c.json({ albums: sortedAlbums });
  } catch (error) {
    console.log(`Error fetching albums: ${error}`);
    return c.json({ error: "Failed to fetch albums" }, 500);
  }
});

// Get single album by ID
app.get("/make-server-097ccdc0/albums/:id", async (c) => {
  try {
    const albumId = c.req.param("id");
    const album = await kv.get(albumId);
    if (!album) {
      return c.json({ error: "Album not found" }, 404);
    }
    return c.json({ album });
  } catch (error) {
    console.log(`Error fetching album: ${error}`);
    return c.json({ error: "Failed to fetch album" }, 500);
  }
});

// Create new album
app.post("/make-server-097ccdc0/albums", async (c) => {
  try {
    const body = await c.req.json();
    const albumId = `album:${Date.now()}`;
    
    // Normalize category to lowercase English
    let category = body.category;
    if (category === '아티스트' || category === 'artist' || category === 'ARTIST' || category === 'Artist') {
      category = 'artist';
    } else if (category === 'OST' || category === 'ost' || category === 'Ost') {
      category = 'ost';
    }
    
    const album = {
      id: albumId,
      ...body,
      category,
      createdAt: new Date().toISOString(),
    };
    await kv.set(albumId, album);
    return c.json({ album });
  } catch (error) {
    console.log(`Error creating album: ${error}`);
    return c.json({ error: "Failed to create album" }, 500);
  }
});

// Update album
app.put("/make-server-097ccdc0/albums/:id", async (c) => {
  try {
    const albumId = c.req.param("id");
    const body = await c.req.json();
    const existingAlbum = await kv.get(albumId);
    if (!existingAlbum) {
      return c.json({ error: "Album not found" }, 404);
    }
    const updatedAlbum = {
      ...existingAlbum,
      ...body,
      id: albumId,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(albumId, updatedAlbum);
    return c.json({ album: updatedAlbum });
  } catch (error) {
    console.log(`Error updating album: ${error}`);
    return c.json({ error: "Failed to update album" }, 500);
  }
});

// Delete album
app.delete("/make-server-097ccdc0/albums/:id", async (c) => {
  try {
    const albumId = c.req.param("id");
    await kv.del(albumId);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting album: ${error}`);
    return c.json({ error: "Failed to delete album" }, 500);
  }
});

// ============ BANNER ROUTES ============

// Get all banners
app.get("/make-server-097ccdc0/banners", async (c) => {
  try {
    const banners = await kv.getByPrefix("banner:");
    return c.json({ banners });
  } catch (error) {
    console.log(`Error fetching banners: ${error}`);
    return c.json({ error: "Failed to fetch banners" }, 500);
  }
});

// Get active banner for Albums page
app.get("/make-server-097ccdc0/banners/active/albums", async (c) => {
  try {
    const banners = await kv.getByPrefix("banner:");
    console.log('All banners in database:', banners);
    const activeBanner = banners.find(b => b.isActive && b.position === 'albums');
    console.log('Active banner for Albums page:', activeBanner);
    return c.json({ banner: activeBanner || null });
  } catch (error) {
    console.log(`Error fetching active banner: ${error}`);
    return c.json({ error: "Failed to fetch active banner" }, 500);
  }
});

// Create new banner
app.post("/make-server-097ccdc0/banners", async (c) => {
  try {
    const body = await c.req.json();
    const bannerId = `banner:${Date.now()}`;
    const banner = {
      id: bannerId,
      ...body,
      createdAt: new Date().toISOString(),
    };
    await kv.set(bannerId, banner);
    return c.json({ banner });
  } catch (error) {
    console.log(`Error creating banner: ${error}`);
    return c.json({ error: "Failed to create banner" }, 500);
  }
});

// Update banner
app.put("/make-server-097ccdc0/banners/:id", async (c) => {
  try {
    const bannerId = c.req.param("id");
    const body = await c.req.json();
    const existingBanner = await kv.get(bannerId);
    if (!existingBanner) {
      return c.json({ error: "Banner not found" }, 404);
    }
    const updatedBanner = {
      ...existingBanner,
      ...body,
      id: bannerId,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(bannerId, updatedBanner);
    return c.json({ banner: updatedBanner });
  } catch (error) {
    console.log(`Error updating banner: ${error}`);
    return c.json({ error: "Failed to update banner" }, 500);
  }
});

// Delete banner
app.delete("/make-server-097ccdc0/banners/:id", async (c) => {
  try {
    const bannerId = c.req.param("id");
    await kv.del(bannerId);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting banner: ${error}`);
    return c.json({ error: "Failed to delete banner" }, 500);
  }
});

// ============ VIDEOS ROUTES ============

// Get all videos
app.get("/make-server-097ccdc0/videos", async (c) => {
  try {
    const videos = await kv.getByPrefix("video:");
    // Sort by createdAt descending
    const sortedVideos = videos.sort((a, b) => {
      const dateA = new Date(a.createdAt || '1970-01-01').getTime();
      const dateB = new Date(b.createdAt || '1970-01-01').getTime();
      return dateB - dateA;
    });
    return c.json({ videos: sortedVideos });
  } catch (error) {
    console.log(`Error fetching videos: ${error}`);
    return c.json({ error: "Failed to fetch videos" }, 500);
  }
});

// Create new video
app.post("/make-server-097ccdc0/videos", async (c) => {
  try {
    const body = await c.req.json();
    const videoId = `video:${Date.now()}`;
    const video = {
      id: videoId,
      ...body,
      createdAt: new Date().toISOString(),
    };
    await kv.set(videoId, video);
    return c.json({ video });
  } catch (error) {
    console.log(`Error creating video: ${error}`);
    return c.json({ error: "Failed to create video" }, 500);
  }
});

// Update video
app.put("/make-server-097ccdc0/videos/:id", async (c) => {
  try {
    const videoId = c.req.param("id");
    const body = await c.req.json();
    const existingVideo = await kv.get(videoId);
    if (!existingVideo) {
      return c.json({ error: "Video not found" }, 404);
    }
    const updatedVideo = {
      ...existingVideo,
      ...body,
      id: videoId,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(videoId, updatedVideo);
    return c.json({ video: updatedVideo });
  } catch (error) {
    console.log(`Error updating video: ${error}`);
    return c.json({ error: "Failed to update video" }, 500);
  }
});

// Delete video
app.delete("/make-server-097ccdc0/videos/:id", async (c) => {
  try {
    const videoId = c.req.param("id");
    await kv.del(videoId);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting video: ${error}`);
    return c.json({ error: "Failed to delete video" }, 500);
  }
});

// Sync videos from YouTube channel
app.post("/make-server-097ccdc0/videos/sync", async (c) => {
  try {
    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    if (!apiKey) {
      return c.json({ error: "YouTube API key not configured" }, 500);
    }

    const channelHandle = "@planbmusickr";
    
    // First, get channel ID from handle
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${channelHandle}&key=${apiKey}`
    );
    
    if (!channelResponse.ok) {
      const errorData = await channelResponse.text();
      console.log(`YouTube API error (channel): ${errorData}`);
      return c.json({ error: "Failed to fetch channel info from YouTube" }, 500);
    }

    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      return c.json({ error: "Channel not found" }, 404);
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Get videos from uploads playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );

    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.text();
      console.log(`YouTube API error (playlist): ${errorData}`);
      return c.json({ error: "Failed to fetch videos from YouTube" }, 500);
    }

    const playlistData = await playlistResponse.json();
    
    // Get existing videos to check for duplicates
    const existingVideos = await kv.getByPrefix("video:");
    const existingVideoIds = new Set(existingVideos.map(v => v.videoId));

    // Get detailed video information including description
    const videoIds = (playlistData.items || []).map(item => item.snippet.resourceId.videoId);
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${apiKey}`
    );

    if (!videoDetailsResponse.ok) {
      const errorData = await videoDetailsResponse.text();
      console.log(`YouTube API error (video details): ${errorData}`);
      return c.json({ error: "Failed to fetch video details from YouTube" }, 500);
    }

    const videoDetailsData = await videoDetailsResponse.json();
    
    // Map video details for easy lookup
    const videoDetailsMap = new Map();
    for (const video of videoDetailsData.items || []) {
      videoDetailsMap.set(video.id, video.snippet);
    }

    // Prepare video data without adding to DB
    const videos = [];
    for (const item of playlistData.items || []) {
      const videoId = item.snippet.resourceId.videoId;
      const details = videoDetailsMap.get(videoId);
      
      videos.push({
        videoId: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: details?.title || item.snippet.title,
        description: details?.description || '',
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        isExisting: existingVideoIds.has(videoId),
        publishedAt: item.snippet.publishedAt,
      });
    }

    return c.json({ 
      success: true, 
      videos: videos,
      total: videos.length,
      existing: videos.filter(v => v.isExisting).length,
    });
  } catch (error) {
    console.log(`Error syncing YouTube videos: ${error}`);
    return c.json({ error: "Failed to sync videos from YouTube" }, 500);
  }
});

// Add selected videos from sync
app.post("/make-server-097ccdc0/videos/bulk-add", async (c) => {
  try {
    const body = await c.req.json();
    const { videos } = body;

    if (!videos || !Array.isArray(videos)) {
      return c.json({ error: "Invalid request body" }, 400);
    }

    let addedCount = 0;
    const existingVideos = await kv.getByPrefix("video:");
    const existingVideoIds = new Set(existingVideos.map(v => v.videoId));

    for (const videoData of videos) {
      // Skip if already exists
      if (existingVideoIds.has(videoData.videoId)) {
        continue;
      }

      const video = {
        id: `video:${Date.now()}_${videoData.videoId}`,
        videoId: videoData.videoId,
        url: videoData.url,
        title: videoData.title,
        description: videoData.description || '',
        thumbnail: videoData.thumbnail,
        isFeatured: false,
        createdAt: new Date().toISOString(),
      };

      await kv.set(video.id, video);
      addedCount++;
      
      // Small delay to avoid overwhelming the KV store
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return c.json({ 
      success: true, 
      message: `${addedCount}개 영상이 추가되었습니다.`,
      added: addedCount,
    });
  } catch (error) {
    console.log(`Error adding videos: ${error}`);
    return c.json({ error: "Failed to add videos" }, 500);
  }
});

// ============ POPUPS ROUTES ============

// Get all popups
app.get("/make-server-097ccdc0/popups", async (c) => {
  try {
    const popups = await kv.getByPrefix("popup:");
    // Sort by createdAt descending
    const sortedPopups = popups.sort((a, b) => {
      const dateA = new Date(a.createdAt || '1970-01-01').getTime();
      const dateB = new Date(b.createdAt || '1970-01-01').getTime();
      return dateB - dateA;
    });
    return c.json({ popups: sortedPopups });
  } catch (error) {
    console.log(`Error fetching popups: ${error}`);
    return c.json({ error: "Failed to fetch popups" }, 500);
  }
});

// Create new popup
app.post("/make-server-097ccdc0/popups", async (c) => {
  try {
    const body = await c.req.json();
    const popupId = `popup:${Date.now()}`;
    const popup = {
      id: popupId,
      ...body,
      createdAt: new Date().toISOString(),
    };
    await kv.set(popupId, popup);
    return c.json({ popup });
  } catch (error) {
    console.log(`Error creating popup: ${error}`);
    return c.json({ error: "Failed to create popup" }, 500);
  }
});

// Update popup
app.put("/make-server-097ccdc0/popups/:id", async (c) => {
  try {
    const popupId = c.req.param("id");
    const body = await c.req.json();
    const existingPopup = await kv.get(popupId);
    if (!existingPopup) {
      return c.json({ error: "Popup not found" }, 404);
    }
    const updatedPopup = {
      ...existingPopup,
      ...body,
      id: popupId,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(popupId, updatedPopup);
    return c.json({ popup: updatedPopup });
  } catch (error) {
    console.log(`Error updating popup: ${error}`);
    return c.json({ error: "Failed to update popup" }, 500);
  }
});

// Delete popup
app.delete("/make-server-097ccdc0/popups/:id", async (c) => {
  try {
    const popupId = c.req.param("id");
    await kv.del(popupId);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting popup: ${error}`);
    return c.json({ error: "Failed to delete popup" }, 500);
  }
});

// ============ CONTACT MESSAGES ROUTES ============

// Get all contact messages (sorted by date, newest first)
app.get("/make-server-097ccdc0/contact-messages", async (c) => {
  try {
    const messages = await kv.getByPrefix("message:");
    // Sort by createdAt descending (newest first)
    const sortedMessages = messages.sort((a, b) => {
      const dateA = new Date(a.createdAt || '1970-01-01').getTime();
      const dateB = new Date(b.createdAt || '1970-01-01').getTime();
      return dateB - dateA;
    });
    return c.json({ messages: sortedMessages });
  } catch (error) {
    console.log(`Error fetching contact messages: ${error}`);
    return c.json({ error: "Failed to fetch contact messages" }, 500);
  }
});

// Create new contact message
app.post("/make-server-097ccdc0/contact-messages", async (c) => {
  try {
    const body = await c.req.json();
    const messageId = `message:${Date.now()}`;
    const message = {
      id: messageId,
      ...body,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    await kv.set(messageId, message);
    return c.json({ message });
  } catch (error) {
    console.log(`Error creating contact message: ${error}`);
    return c.json({ error: "Failed to create contact message" }, 500);
  }
});

// Mark message as read
app.put("/make-server-097ccdc0/contact-messages/:id/read", async (c) => {
  try {
    const messageId = c.req.param("id");
    const existingMessage = await kv.get(messageId);
    if (!existingMessage) {
      return c.json({ error: "Message not found" }, 404);
    }
    const updatedMessage = {
      ...existingMessage,
      isRead: true,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(messageId, updatedMessage);
    return c.json({ message: updatedMessage });
  } catch (error) {
    console.log(`Error marking message as read: ${error}`);
    return c.json({ error: "Failed to mark message as read" }, 500);
  }
});

// Delete contact message
app.delete("/make-server-097ccdc0/contact-messages/:id", async (c) => {
  try {
    const messageId = c.req.param("id");
    await kv.del(messageId);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting contact message: ${error}`);
    return c.json({ error: "Failed to delete contact message" }, 500);
  }
});

// ============ FAQ ROUTES ============

// Get all FAQ items (only visible ones for public, all for admin)
app.get("/make-server-097ccdc0/faqs", async (c) => {
  try {
    const showHidden = c.req.query('showHidden') === 'true';
    const faqs = await kv.getByPrefix("faq:");
    
    // Sort by order
    const sortedFaqs = faqs.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Filter hidden items for public view
    const filteredFaqs = showHidden ? sortedFaqs : sortedFaqs.filter(f => !f.isHidden);
    
    return c.json({ faqs: filteredFaqs });
  } catch (error) {
    console.log(`Error fetching FAQs: ${error}`);
    return c.json({ error: "Failed to fetch FAQs" }, 500);
  }
});

// Create new FAQ
app.post("/make-server-097ccdc0/faqs", async (c) => {
  try {
    const body = await c.req.json();
    const faqId = `faq:${Date.now()}`;
    const faq = {
      id: faqId,
      category: body.category,
      question: body.question,
      answer: body.answer,
      order: body.order || 0,
      isHidden: body.isHidden || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await kv.set(faqId, faq);
    return c.json({ faq });
  } catch (error) {
    console.log(`Error creating FAQ: ${error}`);
    return c.json({ error: "Failed to create FAQ" }, 500);
  }
});

// Update FAQ
app.put("/make-server-097ccdc0/faqs/:id", async (c) => {
  try {
    const faqId = c.req.param("id");
    const body = await c.req.json();
    const existingFaq = await kv.get(faqId);
    
    if (!existingFaq) {
      return c.json({ error: "FAQ not found" }, 404);
    }
    
    const updatedFaq = {
      ...existingFaq,
      category: body.category !== undefined ? body.category : existingFaq.category,
      question: body.question !== undefined ? body.question : existingFaq.question,
      answer: body.answer !== undefined ? body.answer : existingFaq.answer,
      order: body.order !== undefined ? body.order : existingFaq.order,
      isHidden: body.isHidden !== undefined ? body.isHidden : existingFaq.isHidden,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(faqId, updatedFaq);
    return c.json({ faq: updatedFaq });
  } catch (error) {
    console.log(`Error updating FAQ: ${error}`);
    return c.json({ error: "Failed to update FAQ" }, 500);
  }
});

// Toggle FAQ visibility
app.put("/make-server-097ccdc0/faqs/:id/toggle-visibility", async (c) => {
  try {
    const faqId = c.req.param("id");
    const existingFaq = await kv.get(faqId);
    
    if (!existingFaq) {
      return c.json({ error: "FAQ not found" }, 404);
    }
    
    const updatedFaq = {
      ...existingFaq,
      isHidden: !existingFaq.isHidden,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(faqId, updatedFaq);
    return c.json({ faq: updatedFaq });
  } catch (error) {
    console.log(`Error toggling FAQ visibility: ${error}`);
    return c.json({ error: "Failed to toggle FAQ visibility" }, 500);
  }
});

// Delete FAQ
app.delete("/make-server-097ccdc0/faqs/:id", async (c) => {
  try {
    const faqId = c.req.param("id");
    await kv.del(faqId);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting FAQ: ${error}`);
    return c.json({ error: "Failed to delete FAQ" }, 500);
  }
});

// Initialize default FAQs (run once)
app.post("/make-server-097ccdc0/faqs/initialize", async (c) => {
  try {
    const existingFaqs = await kv.getByPrefix("faq:");
    if (existingFaqs.length > 0) {
      return c.json({ message: "FAQs already initialized", count: existingFaqs.length });
    }

    const defaultFaqs = [
      // 발매문의
      { category: '발매문의', order: 1, question: '앨범 등록 파일 스펙을 알고 싶어요.', answer: `음원 파일\nWAV 파일 : 44.1kHz / 16bit 이상 등록가능\n\n앨범 커버 파일\n3,000 x 3,000 픽셀, 10MB 이하의 정방형 JPG 이미지 파일\n\n부클릿 파일\n3,000 x 3,000 픽셀, 10MB 이하의 정방형 JPG 이미지 파일\n\n아티스트 이미지\n3,000 x 3,000 픽셀, 10MB 이하의 정방형 JPG 이미지 파일\n\n뮤직비디오 파일\n3GB 이하의 MP4 또는 MOV 영상파일 (심의본 제출 필수, 영상물등급위원회 심의의 경우 심의 증빙서류 제출 필수)\n\n뮤직비디오 썸네일\n1,280 x 720 픽셀, JPG 이미지 파일\n뮤직비디오 내 화면 캡쳐, 텍스트 추가 등 이미지 편집 불가`, isHidden: false },
      { category: '발매문의', order: 2, question: '뮤직비디오 심의는 어떻게 받나요?', answer: '현재 플랜비에서는 뮤직비디오 심의 대행을 진행하고 있지 않습니다. \n영상물등급위원회를 통해 심의를 받으신 후 심의표기가 된 영상과 심의 증빙서류를 함께 준비해주시면 국내외 플랫폼에 발매가 진행됩니다.', isHidden: false },
      { category: '발매문의', order: 3, question: '앨범이 어떤 플랫폼에 서비스 되나요?', answer: '국내, 해외 메이저 플랫폼 및 소셜 플랫폼에 서비스 됩니다.', isHidden: false },
      { category: '발매문의', order: 4, question: '과거에 발매한 앨범도 유통이 가능한가요?', answer: '네, 과거에 발매한 앨범(구보) 도 발매가 가능합니다. \n다만, 타 유통사를 통해 발매한 앨범은 기존 유통사와의 계약이 만료된 이후 유통이 가능합니다.', isHidden: false },
      { category: '발매문의', order: 5, question: '유통 승인 반려 처리 및 서비스 제한 기준이 궁금해요.', answer: `아래의 경우 승인 반려 처리 또는 서비스 제한이 있을 수 있습니다.\n1.음원의 퀄리티가 정식 디지털 음원 발매 기준에 부합하지 않은 경우\n2.소리 및 묵음 등 반복 재생을 통해 시간을 늘린 경우\n3.재생 시간이 현저히 짧은 경우\n4.어뷰징, 음원 사재기 등 악의적인 행위가 의심이 되는 형태의 음원인 경우\n5.음악의 장르 혹은 스타일이 자사에서 발매하고자 하는 음원과 부합하지 않은 경우\n6.기타 음원 플랫폼사의 정책에 따라 발매가 어려울 것으로 결정된 경우\n7.기타 자사가 판단하기에 발매가 어려울 것으로 결정된 경우`, isHidden: false },
      { category: '발매문의', order: 6, question: '리마스터링 앨범을 발매 하고 싶어요.', answer: '리마스터링 앨범의 경우 원 권리사의 승인이 필요합니다. \n원작 앨범이 플랜비을 통해 발매 되었을 경우 아무런 절차 없이 발매가 가능하고, 타 유통사를 통해 발매된 음원의 경우 유통사의 계약관계를 확인하시고 기존 유통사의 사용 및 정산 승인허가(국내, 해외 모든 플랫폼)를 메일 원본 전달 또는 공문 형식으로 받으셔야 합니다.', isHidden: false },
      
      // 정산 문의 (기본값은 표시 - 관리자가 직접 숨김 처리)
      { category: '정산 문의', order: 11, question: '유통 수수료는 어떻게 되나요?', answer: '유통수수료는 20%로 적용되고, 매월 제공되는 정산 리포트를 통해 수익 현황을 투명하게 확인할 수 있습니다.', isHidden: false },
      { category: '정산 문의', order: 12, question: '앨범 발매 후 정산금은 언제 확인할 수 있나요? 입금은 언제 되나요?', answer: `앨범 발매월(M) 기준으로 2개월 후 말일(M+2)까지 정산 리포트를 제공하고 있고,\n앨범 발매 3개월 후 말일까지(M+3) 정산금이 입금됩니다. \n\n-예시 (아래 기준으로 매달 정산)\n1월 15일 앨범 첫 발매\n3월 30일까지 정산 리포트 제공, 정산금 세부내역 확인 가능 (1/15 ~ 1/31 판매내역)\n4월 30일까지 정산금 입금 (1/15 ~ 1/31 판매내역)`, isHidden: false },
      { category: '정산 문의', order: 13, question: '정산 리포트와 정산금은 어디에서 확인할 수 있나요?', answer: '매월 안내되는 정산사이트 주소에 로그인 후 [정산조회] 에서 세부 정보를 확인할 수 있습니다.', isHidden: false },
      { category: '정산 문의', order: 14, question: '정산금의 최소 입금액이 얼마인가요?', answer: '플랜비는 단돈 1원이 발생되더라도 매월 정산해 드리고 있습니다.', isHidden: false },
      { category: '정산 문의', order: 15, question: '입금 계좌 정보를 수정하고 싶어요.', answer: '계좌번호 변경이 필요한 경우 당사 오피셜 메일주소로 문의해주시기 바랍니다. 계좌 변경 시점에 따라 실제 입금은 1~2개월 늦게 반영될 수 있습니다.', isHidden: false },
      
      // 프로모션 / 기타 문의
      { category: '프로모션 / 기타 문의', order: 21, question: '음원 플랫폼 최신 앨범 노출 1면은 가능한가요?', answer: '최신 앨범 노출은 플랫폼사들의 고유 권한임에 따라 1면 노출 개런티가 불가능합니다. 보통 아티스트의 인지도, 전작 앨범의 흥행성, 아티스트 팔로워 수를 종합적으로 고려하여 큐레이션하고 있습니다.', isHidden: false },
      { category: '프로모션 / 기타 문의', order: 22, question: '앨범, 트랙, 아티스트 정보를 수정하고 싶어요.', answer: '당사 오피셜 메일로 수정 내용(최종자료)을 전달 주시면 수정이 가능합니다.\n단, 플랫폼 정책에 따라 플랫폼에서 제공하는 사이트를 통해 아티스트(기획사)가 직접 수정해야하는 경우도 있습니다. (Ex. Spotify, Apple Music 등)', isHidden: false },
    ];

    let count = 0;
    for (const faqData of defaultFaqs) {
      const faqId = `faq:${Date.now()}_${count}`;
      const faq = {
        id: faqId,
        ...faqData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await kv.set(faqId, faq);
      count++;
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    return c.json({ success: true, message: `${count}개의 FAQ가 초기화되었습니다.`, count });
  } catch (error) {
    console.log(`Error initializing FAQs: ${error}`);
    return c.json({ error: "Failed to initialize FAQs" }, 500);
  }
});

// ============ AUTH ROUTES ============

// Admin login
app.post("/make-server-097ccdc0/admin/login", async (c) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;

    // Simple hardcoded credentials (for production, use proper authentication)
    const ADMIN_USERNAME = "ryukwangmin76@gmail.com";
    const ADMIN_PASSWORD = "vmffosql2025!";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate a simple session token
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Store session in KV with expiration info
      const session = {
        id: `session:${sessionToken}`,
        username: ADMIN_USERNAME,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };
      
      await kv.set(session.id, session);
      
      return c.json({ 
        success: true, 
        token: sessionToken,
        message: "로그인 성공"
      });
    } else {
      return c.json({ 
        success: false, 
        error: "아이디 또는 비밀번호가 올바르지 않습니다." 
      }, 401);
    }
  } catch (error) {
    console.log(`Error during admin login: ${error}`);
    return c.json({ error: "로그인 처리 중 오류가 발생했습니다." }, 500);
  }
});

// Verify admin session
app.post("/make-server-097ccdc0/admin/verify", async (c) => {
  try {
    const body = await c.req.json();
    const { token } = body;

    if (!token) {
      return c.json({ valid: false }, 401);
    }

    const session = await kv.get(`session:${token}`);
    
    if (!session) {
      return c.json({ valid: false }, 401);
    }

    // Check if session is expired
    const expiresAt = new Date(session.expiresAt).getTime();
    const now = Date.now();
    
    if (now > expiresAt) {
      await kv.del(`session:${token}`);
      return c.json({ valid: false, error: "세션이 만료되었습니다." }, 401);
    }

    return c.json({ 
      valid: true,
      username: session.username 
    });
  } catch (error) {
    console.log(`Error verifying admin session: ${error}`);
    return c.json({ valid: false }, 500);
  }
});

// Admin logout
app.post("/make-server-097ccdc0/admin/logout", async (c) => {
  try {
    const body = await c.req.json();
    const { token } = body;

    if (token) {
      await kv.del(`session:${token}`);
    }

    return c.json({ success: true, message: "로그아웃 되었습니다." });
  } catch (error) {
    console.log(`Error during admin logout: ${error}`);
    return c.json({ error: "로그아웃 처리 중 오류가 발생했습니다." }, 500);
  }
});

Deno.serve(app.fetch);