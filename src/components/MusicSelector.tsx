
import { useState } from 'react';
import { Check, Music, PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Song } from '@/types';

// Organized music data by categories
const MUSIC_LIBRARY = {
  trending: [
    {
      id: '1',
      title: 'Whenever',
      artist: 'Macan',
      url: 'https://example.com/audio1.mp3',
      category: 'trending'
    },
    {
      id: '2',
      title: 'Water',
      artist: 'Tyla',
      url: 'https://example.com/audio2.mp3',
      category: 'trending'
    },
    {
      id: '3',
      title: 'Espresso',
      artist: 'Sabrina Carpenter',
      url: 'https://example.com/audio3.mp3',
      category: 'trending'
    }
  ],
  upbeat: [
    {
      id: '4',
      title: 'Texas Hold Em',
      artist: 'Beyoncé',
      url: 'https://example.com/audio4.mp3',
      category: 'upbeat'
    },
    {
      id: '5',
      title: 'Not Like Us',
      artist: 'Kendrick Lamar',
      url: 'https://example.com/audio5.mp3',
      category: 'upbeat'
    },
    {
      id: '6',
      title: 'Paint The Town Red',
      artist: 'Doja Cat',
      url: 'https://example.com/audio6.mp3',
      category: 'upbeat'
    }
  ],
  ambient: [
    {
      id: '7',
      title: 'Floating',
      artist: 'Ambient Collective',
      url: 'https://example.com/ambient1.mp3',
      category: 'ambient'
    },
    {
      id: '8',
      title: 'Serenity',
      artist: 'Calm Waters',
      url: 'https://example.com/ambient2.mp3',
      category: 'ambient'
    },
    {
      id: '9',
      title: 'Deep Focus',
      artist: 'Mind Flow',
      url: 'https://example.com/ambient3.mp3',
      category: 'ambient'
    }
  ],
  motivational: [
    {
      id: '10',
      title: 'Rise Up',
      artist: 'Inspire',
      url: 'https://example.com/motivational1.mp3',
      category: 'motivational'
    },
    {
      id: '11',
      title: 'Journey',
      artist: 'Path Finders',
      url: 'https://example.com/motivational2.mp3',
      category: 'motivational'
    },
    {
      id: '12',
      title: 'Breakthrough',
      artist: 'Success Story',
      url: 'https://example.com/motivational3.mp3',
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
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('trending');

  const handleSelectSong = (song: Song) => {
    onSelectSong(selectedSongId === song.id ? null : song);
  };

  const handlePlayPreview = (songId: string, url: string) => {
    if (playing === songId) {
      audioEl?.pause();
      setPlaying(null);
      return;
    }
    
    if (audioEl) {
      audioEl.pause();
    }
    
    // In a real application, we would use actual audio URLs
    // For now, we'll just simulate play/pause behavior
    const audio = new Audio(url);
    setAudioEl(audio);
    
    // In a real app, this would actually play sound
    // audio.play().catch(console.error);
    
    setPlaying(songId);
    
    // Automatically stop after 10 seconds
    setTimeout(() => {
      if (setPlaying) {
        setPlaying(null);
      }
    }, 10000);
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
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPreview(song.id, song.url);
              }}
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
    </div>
  );
};

export default MusicSelector;
