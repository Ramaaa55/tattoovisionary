
import { useState } from 'react';
import { Voice, Subtitle } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Plus, X, PlayCircle, StopCircle, Type } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// Sample voices data
const AVAILABLE_VOICES: Voice[] = [
  { id: 'v1', name: 'Alex', accent: 'American' },
  { id: 'v2', name: 'Sarah', accent: 'British' },
  { id: 'v3', name: 'Emily', accent: 'Australian' },
  { id: 'v4', name: 'Michael', accent: 'Canadian' },
  { id: 'v5', name: 'David', accent: 'Scottish' },
];

// Sample subtitle colors
const SUBTITLE_COLORS = [
  { value: '#FFFFFF', label: 'White', className: 'bg-white text-black' },
  { value: '#F97316', label: 'Orange', className: 'bg-orange-500 text-white' },
  { value: '#8B5CF6', label: 'Purple', className: 'bg-purple-500 text-white' },
  { value: '#22C55E', label: 'Green', className: 'bg-green-500 text-white' },
  { value: '#3B82F6', label: 'Blue', className: 'bg-blue-500 text-white' },
  { value: '#EF4444', label: 'Red', className: 'bg-red-500 text-white' },
  { value: '#F59E0B', label: 'Amber', className: 'bg-amber-500 text-white' },
  { value: '#EC4899', label: 'Pink', className: 'bg-pink-500 text-white' },
];

interface VoiceOverOptionsProps {
  duration: number;
  onVoiceChange: (voice: Voice | null) => void;
  onScriptChange: (script: string) => void;
  onSubtitlesChange: (subtitles: Subtitle[]) => void;
  selectedVoiceId?: string;
}

const VoiceOverOptions = ({ 
  duration, 
  onVoiceChange, 
  onScriptChange, 
  onSubtitlesChange,
  selectedVoiceId 
}: VoiceOverOptionsProps) => {
  const [script, setScript] = useState('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [currentStartTime, setCurrentStartTime] = useState(0);
  const [currentEndTime, setCurrentEndTime] = useState(5);
  const [currentColor, setCurrentColor] = useState('#FFFFFF');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVoiceSelect = (voiceId: string) => {
    const selectedVoice = AVAILABLE_VOICES.find(v => v.id === voiceId) || null;
    onVoiceChange(selectedVoice);
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newScript = e.target.value;
    setScript(newScript);
    onScriptChange(newScript);
  };

  const handleAddSubtitle = () => {
    if (!currentSubtitle.trim()) return;
    
    const newSubtitle: Subtitle = {
      text: currentSubtitle,
      startTime: currentStartTime,
      endTime: currentEndTime,
      color: currentColor
    };
    
    const updatedSubtitles = [...subtitles, newSubtitle].sort((a, b) => a.startTime - b.startTime);
    setSubtitles(updatedSubtitles);
    onSubtitlesChange(updatedSubtitles);
    
    // Reset form
    setCurrentSubtitle('');
    setCurrentStartTime(Math.min(currentEndTime, duration));
    setCurrentEndTime(Math.min(currentEndTime + 5, duration));
  };

  const handleRemoveSubtitle = (index: number) => {
    const updatedSubtitles = subtitles.filter((_, i) => i !== index);
    setSubtitles(updatedSubtitles);
    onSubtitlesChange(updatedSubtitles);
  };

  const handlePlayPreview = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would actually play the voice with the script
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Over
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Voice</label>
            <Select 
              onValueChange={handleVoiceSelect}
              value={selectedVoiceId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_VOICES.map(voice => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name} ({voice.accent})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handlePlayPreview}
              disabled={!selectedVoiceId || !script.trim()}
            >
              {isPlaying ? (
                <>
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Preview
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Preview Voice
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Voice Script</label>
          <Textarea
            placeholder="Enter your voice over script here..."
            className="min-h-32"
            value={script}
            onChange={handleScriptChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            This text will be converted to speech using the selected voice.
          </p>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
          <Type className="h-5 w-5" />
          Colorful Subtitles
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Subtitle Text</label>
            <Input
              placeholder="Enter subtitle text..."
              value={currentSubtitle}
              onChange={(e) => setCurrentSubtitle(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Start Time: {formatTime(currentStartTime)}
              </label>
              <Slider
                value={[currentStartTime]}
                min={0}
                max={duration}
                step={0.5}
                onValueChange={(value) => {
                  const newStart = value[0];
                  setCurrentStartTime(newStart);
                  if (newStart >= currentEndTime) {
                    setCurrentEndTime(Math.min(newStart + 2, duration));
                  }
                }}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                End Time: {formatTime(currentEndTime)}
              </label>
              <Slider
                value={[currentEndTime]}
                min={0}
                max={duration}
                step={0.5}
                onValueChange={(value) => {
                  const newEnd = value[0];
                  setCurrentEndTime(newEnd);
                  if (newEnd <= currentStartTime) {
                    setCurrentStartTime(Math.max(newEnd - 2, 0));
                  }
                }}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Subtitle Color</label>
            <div className="flex flex-wrap gap-2">
              {SUBTITLE_COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all
                    ${color.className}
                    ${currentColor === color.value 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : 'opacity-70 hover:opacity-100'}
                  `}
                  onClick={() => setCurrentColor(color.value)}
                  title={color.label}
                />
              ))}
            </div>
          </div>
          
          <Button
            onClick={handleAddSubtitle}
            disabled={!currentSubtitle.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subtitle
          </Button>
        </div>
        
        {subtitles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Current Subtitles</h4>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {subtitles.map((subtitle, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      <span
                        className="px-2 py-1 rounded"
                        style={{ backgroundColor: subtitle.color, color: subtitle.color === '#FFFFFF' ? 'black' : 'white' }}
                      >
                        {subtitle.text}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveSubtitle(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceOverOptions;
