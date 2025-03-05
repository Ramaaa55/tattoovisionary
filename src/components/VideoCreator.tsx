
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import MusicSelector from './MusicSelector';
import { Image, Song } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { Video, Film, Download, Loader2 } from 'lucide-react';

interface VideoCreatorProps {
  selectedImages: Image[];
}

const VideoCreator = ({ selectedImages = [] }: VideoCreatorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [duration, setDuration] = useState<number>(3);
  const [isCreating, setIsCreating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Clear any previous video when selected images change
  useEffect(() => {
    setVideoUrl(null);
  }, [selectedImages]);

  // In a real application, this would generate a real video
  // For now, we'll simulate video creation
  const createVideo = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to create a video",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setVideoUrl(null);

    try {
      // This is a simulation - in a real app, you would:
      // 1. Send the selected images to a backend service for processing
      // 2. The backend would create a video with transitions between images
      // 3. If a song was selected, it would be added to the video
      // 4. The backend would return a URL to the created video
      
      // Simulate processing time based on number of images and duration
      const processingTime = 1000 + (selectedImages.length * 500);
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // For demonstration, we'll just use the first image as a "video preview"
      const previewImage = selectedImages[0]?.url || '';
      
      setVideoUrl(previewImage);
      
      toast({
        title: "Video created!",
        description: "Your video is ready to download",
      });
    } catch (error) {
      toast({
        title: "Video creation failed",
        description: "There was an error creating your video",
        variant: "destructive"
      });
      console.error("Error creating video:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Download the video (simulated)
  const downloadVideo = () => {
    if (!videoUrl) return;
    
    toast({
      title: "Video download started",
      description: "Your video is being downloaded",
    });
    
    // In a real application, this would download the actual video file
    // For now, we'll just download the image as a simulation
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `tattoo-video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="video-creator" className="py-20 md:py-24 bg-secondary/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Create Stunning Videos
          </h2>
          <p className="text-foreground/70 text-lg">
            Transform your tattoo designs into engaging videos for social media
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Film className="h-5 w-5" />
                Video Settings
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="font-medium text-sm">
                    Duration: {duration} seconds
                  </label>
                  <Slider
                    value={[duration]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setDuration(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="font-medium text-sm">
                    Selected Images: {selectedImages.length}
                  </label>
                  {selectedImages.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedImages.map((image, i) => (
                        <div key={i} className="min-w-16 h-16 rounded-md overflow-hidden border">
                          <img 
                            src={image.url} 
                            alt={`Selected ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Please select images from the generator above
                    </p>
                  )}
                </div>
                
                <MusicSelector 
                  onSelectSong={setSelectedSong}
                  selectedSongId={selectedSong?.id}
                />
                
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={createVideo}
                    disabled={isCreating || selectedImages.length === 0}
                    className="w-full rounded-full hover-scale"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Video...
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-4 w-4" />
                        Create Video
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-medium mb-4">Video Preview</h3>
            
            <div className="flex-1 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
              {videoUrl ? (
                <div className="relative w-full h-full">
                  <img 
                    src={videoUrl} 
                    alt="Video preview" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 text-white px-4 py-2 rounded-md">
                      Video Preview (Simulation)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center px-4">
                  <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground font-medium">
                    {isCreating 
                      ? "Creating your video..." 
                      : "Your video preview will appear here"}
                  </p>
                </div>
              )}
            </div>
            
            {videoUrl && (
              <Button
                onClick={downloadVideo}
                className="mt-4 rounded-full hover-scale"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Video
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoCreator;
