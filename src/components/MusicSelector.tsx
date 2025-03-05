
import { useState } from 'react';
import { Check, Music, PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Song } from '@/types';

// Mock data for trending songs (in a real app, this would come from an API)
const TRENDING_SONGS: Song[] = [
  {
    id: '1',
    title: 'Whenever',
    artist: 'Macan',
    url: 'https://example.com/audio1.mp3'
  },
  {
    id: '2',
    title: 'Water',
    artist: 'Tyla',
    url: 'https://example.com/audio2.mp3'
  },
  {
    id: '3',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    url: 'https://example.com/audio3.mp3'
  },
  {
    id: '4',
    title: 'Texas Hold 'Em',
    artist: 'Beyoncé',
    url: 'https://example.com/audio4.mp3'
  },
  {
    id: '5',
    title: 'Not Like Us',
    artist: 'Kendrick Lamar',
    url: 'https://example.com/audio5.mp3'
  },
  {
    id: '6',
    title: 'Paint The Town Red',
    artist: 'Doja Cat',
    url: 'https://example.com/audio6.mp3'
  }
];

interface MusicSelectorProps {
  onSelectSong: (song: Song | null) => void;
  selectedSongId?: string;
}

const MusicSelector = ({ onSelectSong, selectedSongId }: MusicSelectorProps) => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

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

  return (
    <div className="rounded-2xl glass p-6">
      <div className="flex items-center gap-3 mb-5">
        <Music className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Select Music</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TRENDING_SONGS.map((song) => (
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
    </div>
  );
};

export default MusicSelector;
