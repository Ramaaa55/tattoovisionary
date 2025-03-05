
import { useState } from 'react';
import { BackgroundVideo } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Search, PlayCircle, PauseCircle } from 'lucide-react';

// Sample background videos data
const BACKGROUND_VIDEOS: Record<string, BackgroundVideo[]> = {
  minecraft: [
    {
      id: 'mc1',
      title: 'Minecraft Parkour Challenge',
      url: 'https://example.com/videos/minecraft-parkour-1.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/minecraft-parkour-1.jpg',
      category: 'minecraft'
    },
    {
      id: 'mc2',
      title: 'Epic Minecraft Jumps',
      url: 'https://example.com/videos/minecraft-parkour-2.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/minecraft-parkour-2.jpg',
      category: 'minecraft'
    },
    {
      id: 'mc3',
      title: 'Minecraft Obstacle Course',
      url: 'https://example.com/videos/minecraft-parkour-3.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/minecraft-parkour-3.jpg',
      category: 'minecraft'
    }
  ],
  gaming: [
    {
      id: 'gm1',
      title: 'Gaming Montage',
      url: 'https://example.com/videos/gaming-1.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/gaming-1.jpg',
      category: 'gaming'
    },
    {
      id: 'gm2',
      title: 'Epic Gaming Moments',
      url: 'https://example.com/videos/gaming-2.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/gaming-2.jpg',
      category: 'gaming'
    }
  ],
  nature: [
    {
      id: 'nat1',
      title: 'Serene Landscapes',
      url: 'https://example.com/videos/nature-1.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/nature-1.jpg',
      category: 'nature'
    },
    {
      id: 'nat2',
      title: 'Ocean Waves',
      url: 'https://example.com/videos/nature-2.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/nature-2.jpg',
      category: 'nature'
    }
  ]
};

interface BackgroundVideoSelectorProps {
  onSelectVideo: (video: BackgroundVideo | null) => void;
  selectedVideoId?: string;
}

const BackgroundVideoSelector = ({ onSelectVideo, selectedVideoId }: BackgroundVideoSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('minecraft');
  const [playing, setPlaying] = useState<string | null>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to search for videos
    console.log('Searching for:', searchQuery);
  };

  const handleSelectVideo = (video: BackgroundVideo) => {
    onSelectVideo(selectedVideoId === video.id ? null : video);
  };

  const handlePlayPreview = (videoId: string, url: string) => {
    if (playing === videoId) {
      videoEl?.pause();
      setPlaying(null);
      return;
    }
    
    if (videoEl) {
      videoEl.pause();
    }
    
    // In a real application, we would use actual video URLs
    const video = document.createElement('video');
    video.src = url;
    setVideoEl(video);
    
    // In a real app, this would actually play video
    // video.play().catch(console.error);
    
    setPlaying(videoId);
    
    // Automatically stop after 10 seconds
    setTimeout(() => {
      if (setPlaying) {
        setPlaying(null);
      }
    }, 10000);
  };

  // Filter videos based on search query
  const getFilteredVideos = (category: string) => {
    const videos = BACKGROUND_VIDEOS[category] || [];
    if (!searchQuery) return videos;
    
    return videos.filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Render video grid
  const renderVideoGrid = (category: string) => {
    const videos = getFilteredVideos(category);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div 
              key={video.id}
              className={`
                flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer
                ${selectedVideoId === video.id ? 'border-primary bg-primary/5' : 'hover:bg-secondary/50'}
              `}
              onClick={() => handleSelectVideo(video)}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-20 rounded-md overflow-hidden">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute inset-0 h-full w-full bg-black/30 rounded-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPreview(video.id, video.url);
                    }}
                  >
                    {playing === video.id ? (
                      <PauseCircle className="h-8 w-8 text-white" />
                    ) : (
                      <PlayCircle className="h-8 w-8 text-white" />
                    )}
                  </Button>
                </div>
                
                <div>
                  <p className="font-medium text-sm line-clamp-2">{video.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{video.category}</p>
                </div>
              </div>
              
              {selectedVideoId === video.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 py-6 text-center text-muted-foreground">
            No videos found matching "{searchQuery}"
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl glass p-6">
      <h3 className="text-lg font-medium mb-4">Select Background Video</h3>
      
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Search Minecraft parkour videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      <Tabs defaultValue="minecraft" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="minecraft">Minecraft</TabsTrigger>
          <TabsTrigger value="gaming">Gaming</TabsTrigger>
          <TabsTrigger value="nature">Nature</TabsTrigger>
        </TabsList>
        
        <TabsContent value="minecraft">
          {renderVideoGrid('minecraft')}
        </TabsContent>
        
        <TabsContent value="gaming">
          {renderVideoGrid('gaming')}
        </TabsContent>
        
        <TabsContent value="nature">
          {renderVideoGrid('nature')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackgroundVideoSelector;
