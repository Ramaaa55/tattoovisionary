
import { useState, useRef } from 'react';
import { Check, Music, PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Song } from '@/types';

// Organized music data by categories with actual audio URLs
const MUSIC_LIBRARY = {
  trending: [
    {
      id: '1',
      title: 'Whenever',
      artist: 'Macan',
      url: 'https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3',
      category: 'trending'
    },
    {
      id: '2',
      title: 'Water',
      artist: 'Tyla',
      url: 'https://assets.mixkit.co/music/preview/mixkit-sun-and-his-daughter-580.mp3',
      category: 'trending'
    },
    {
      id: '3',
      title: 'Espresso',
      artist: 'Sabrina Carpenter',
      url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
      category: 'trending'
    }
  ],
  upbeat: [
    {
      id: '4',
      title: 'Texas Hold Em',
      artist: 'Beyoncé',
      url: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3',
      category: 'upbeat'
    },
    {
      id: '5',
      title: 'Not Like Us',
      artist: 'Kendrick Lamar',
      url: 'https://assets.mixkit.co/music/preview/mixkit-hazy-after-hours-132.mp3',
      category: 'upbeat'
    },
    {
      id: '6',
      title: 'Paint The Town Red',
      artist: 'Doja Cat',
      url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      category: 'upbeat'
    }
  ],
  ambient: [
    {
      id: '7',
      title: 'Floating',
      artist: 'Ambient Collective',
      url: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',
      category: 'ambient'
    },
    {
      id: '8',
      title: 'Serenity',
      artist: 'Calm Waters',
      url: 'https://assets.mixkit.co/music/preview/mixkit-spirit-of-the-past-99.mp3',
      category: 'ambient'
    },
    {
      id: '9',
      title: 'Deep Focus',
      artist: 'Mind Flow',
      url: 'https://assets.mixkit.co/music/preview/mixkit-valley-sunset-127.mp3',
      category: 'ambient'
    }
  ],
  motivational: [
    {
      id: '10',
      title: 'Rise Up',
      artist: 'Inspire',
      url: 'https://assets.mixkit.co/music/preview/mixkit-motivational-achievement-12.mp3',
      category: 'motivational'
    },
    {
      id: '11',
      title: 'Journey',
      artist: 'Path Finders',
      url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      category: 'motivational'
    },
    {
      id: '12',
      title: 'Breakthrough',
      artist: 'Success Story',
      url: 'https://assets.mixkit.co/music/preview/mixkit-getting-ready-46.mp3',
      category: 'motivational'
    }
  ]
};

interface MusicSelectorProps {
  onSelectSong: (song: Song | null) => void;
  selectedSongId?: string;
}

const MusicSelector = ({ onSelectSong, selectedSongId }: MusicSelectorProps) => {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('trending');

  const handleSelectSong = (song: Song) => {
    onSelectSong(selectedSongId === song.id ? null : song);
  };

  const handlePlayPreview = (songId: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (playing === songId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlaying(null);
      return;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Create a new audio element
    const audio = new Audio(url);
    audio.volume = 0.5;
    audioRef.current = audio;
    
    // Play the audio
    audio.play().catch(err => {
      console.error("Error playing audio:", err);
    });
    
    setPlaying(songId);
    
    // Add event listener to handle when audio ends
    audio.addEventListener('ended', () => {
      setPlaying(null);
    });
  };

  // Helper function to render song items
  const renderSongList = (songs: Song[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {songs.map((song) => (
        <div 
          key={song.id}
          className={`
            flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer
            ${selectedSongId === song.id ? 'border-primary bg-primary/5' : 'hover:bg-secondary/50'}
          `}
          onClick={() => handleSelectSong(song)}
        >
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={(e) => handlePlayPreview(song.id, song.url, e)}
            >
              {playing === song.id ? (
                <PauseCircle className="h-8 w-8 text-primary" />
              ) : (
                <PlayCircle className="h-8 w-8" />
              )}
            </Button>
            
            <div>
              <p className="font-medium text-sm">{song.title}</p>
              <p className="text-xs text-muted-foreground">{song.artist}</p>
            </div>
          </div>
          
          {selectedSongId === song.id && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="rounded-2xl glass p-6">
      <div className="flex items-center gap-3 mb-5">
        <Music className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Select Music</h3>
      </div>
      
      <Tabs defaultValue="trending" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="upbeat">Upbeat</TabsTrigger>
          <TabsTrigger value="ambient">Ambient</TabsTrigger>
          <TabsTrigger value="motivational">Motivational</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending">
          {renderSongList(MUSIC_LIBRARY.trending)}
        </TabsContent>
        
        <TabsContent value="upbeat">
          {renderSongList(MUSIC_LIBRARY.upbeat)}
        </TabsContent>
        
        <TabsContent value="ambient">
          {renderSongList(MUSIC_LIBRARY.ambient)}
        </TabsContent>
        
        <TabsContent value="motivational">
          {renderSongList(MUSIC_LIBRARY.motivational)}
        </TabsContent>
      </Tabs>
      
      {/* Hidden audio element for playing music */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default MusicSelector;
