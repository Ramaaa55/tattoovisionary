import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import MusicSelector from './MusicSelector';
import BackgroundVideoSelector from './BackgroundVideoSelector';
import VoiceOverOptions from './VoiceOverOptions';
import type { Image, Song, Voice, Subtitle, BackgroundVideo } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Video, Film, Download, Loader2, Zap, Share2, Mic, Type } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VideoCreatorProps {
  selectedImages: Image[];
}

const VideoCreator = ({ selectedImages = [] }: VideoCreatorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedBackgroundVideo, setSelectedBackgroundVideo] = useState<BackgroundVideo | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [voiceScript, setVoiceScript] = useState<string>('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  
  const [duration, setDuration] = useState<number>(3);
  const [isCreating, setIsCreating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("images");
  
  const { toast } = useToast();

  // Clear any previous video when selected images change
  useEffect(() => {
    setVideoUrl(null);
  }, [selectedImages]);

  // Create video from images using HTML Canvas
  const createVideo = async () => {
    if (activeTab === "images" && selectedImages.length === 0) {
      toast({
        title: "No content selected",
        description: "Please select at least one image or a background video",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setVideoUrl(null);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas dimensions
      canvas.width = 1080;
      canvas.height = 1920;

      // Load all images first if using image mode
      let loadedImages: HTMLImageElement[] = [];
      if (activeTab === "images") {
        loadedImages = await Promise.all(
          selectedImages.map((image) => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.onerror = (e) => reject(e);
              img.src = image.url;
            });
          })
        );
      }
      
      // Load background video if selected
      let backgroundVideoElement: HTMLVideoElement | null = null;
      if (activeTab === "video" && selectedBackgroundVideo) {
        backgroundVideoElement = document.createElement('video');
        backgroundVideoElement.crossOrigin = "anonymous";
        backgroundVideoElement.src = selectedBackgroundVideo.url;
        backgroundVideoElement.muted = true;
        
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (!backgroundVideoElement) return resolve();
          backgroundVideoElement.onloadeddata = () => resolve();
          backgroundVideoElement.load();
        });
        
        // Start playing the video
        await backgroundVideoElement.play();
      }

      // Create a MediaRecorder to capture canvas frames
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Stop background video if it's playing
        backgroundVideoElement?.pause();
        
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        
        if (previewVideoRef.current) {
          previewVideoRef.current.src = url;
          
          // Add audio to preview if a song was selected
          if (selectedSong) {
            const audio = new Audio(selectedSong.url);
            audio.loop = true;
            audioRef.current = audio;
            
            // When video starts playing, play the audio
            previewVideoRef.current.onplay = () => {
              audio.play().catch(console.error);
            };
            
            // When video pauses, pause the audio
            previewVideoRef.current.onpause = () => {
              audio.pause();
            };
          }
          
          previewVideoRef.current.play().catch(console.error);
        }
        
        setIsCreating(false);
        
        toast({
          title: "Video created!",
          description: "Your video is ready to download",
        });
      };

      mediaRecorder.start();
      
      // Animation timing variables
      const frameDuration = 1000 / 30; // 30fps
      const totalDuration = duration * 1000 + 3000; // Add 3 seconds for CTA
      const imageDuration = activeTab === "images" ? duration * 1000 / loadedImages.length : 0;
      
      let startTime: number;
      
      // Font sizes based on canvas dimensions
      const titleFontSize = Math.round(canvas.height * 0.05);
      const ctaFontSize = Math.round(canvas.height * 0.06);
      const subtitleFontSize = Math.round(canvas.height * 0.04);
      
      // Animation function
      const animate = async (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        if (elapsed > totalDuration) {
          mediaRecorder.stop();
          return;
        }
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (elapsed < duration * 1000) {
          // Main content part of the video
          if (activeTab === "images" && loadedImages.length > 0) {
            // Image slideshow approach
            const currentImageIndex = Math.min(
              Math.floor(elapsed / imageDuration),
              loadedImages.length - 1
            );
            
            const img = loadedImages[currentImageIndex];
            
            // Draw image fitted to canvas maintaining aspect ratio
            const scale = Math.max(
              canvas.width / img.width,
              canvas.height / img.height
            );
            
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const offsetX = (canvas.width - scaledWidth) / 2;
            const offsetY = (canvas.height - scaledHeight) / 2;
            
            ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
            
            // Add fade transition between images
            const fadeProgress = (elapsed % imageDuration) / imageDuration;
            if (fadeProgress > 0.8 && currentImageIndex < loadedImages.length - 1) {
              const nextImg = loadedImages[currentImageIndex + 1];
              const fadeAlpha = (fadeProgress - 0.8) * 5; // 0 to 1 in the last 20% of the time
              
              ctx.globalAlpha = fadeAlpha;
              const nextScale = Math.max(
                canvas.width / nextImg.width,
                canvas.height / nextImg.height
              );
              
              const nextScaledWidth = nextImg.width * nextScale;
              const nextScaledHeight = nextImg.height * nextScale;
              const nextOffsetX = (canvas.width - nextScaledWidth) / 2;
              const nextOffsetY = (canvas.height - nextScaledHeight) / 2;
              
              ctx.drawImage(nextImg, nextOffsetX, nextOffsetY, nextScaledWidth, nextScaledHeight);
              ctx.globalAlpha = 1;
            }
          } else if (activeTab === "video" && backgroundVideoElement) {
            // Background video approach
            // Draw the current frame of the video to the canvas
            const scale = Math.max(
              canvas.width / backgroundVideoElement.videoWidth,
              canvas.height / backgroundVideoElement.videoHeight
            );
            
            const scaledWidth = backgroundVideoElement.videoWidth * scale;
            const scaledHeight = backgroundVideoElement.videoHeight * scale;
            const offsetX = (canvas.width - scaledWidth) / 2;
            const offsetY = (canvas.height - scaledHeight) / 2;
            
            ctx.drawImage(backgroundVideoElement, offsetX, offsetY, scaledWidth, scaledHeight);
          }
          
          // Draw subtitles if available
          if (subtitles.length > 0) {
            const currentTime = elapsed / 1000; // Convert to seconds
            const activeSubtitles = subtitles.filter(
              sub => currentTime >= sub.startTime && currentTime <= sub.endTime
            );
            
            activeSubtitles.forEach(subtitle => {
              ctx.font = `bold ${subtitleFontSize}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // Add text shadow/outline for better visibility
              ctx.strokeStyle = 'black';
              ctx.lineWidth = subtitleFontSize / 10;
              ctx.strokeText(
                subtitle.text, 
                canvas.width / 2, 
                canvas.height * 0.85
              );
              
              // Draw text with the selected color
              ctx.fillStyle = subtitle.color || '#FFFFFF';
              ctx.fillText(
                subtitle.text, 
                canvas.width / 2, 
                canvas.height * 0.85
              );
            });
          }
        } else {
          // CTA part - last 3 seconds
          const ctaElapsed = elapsed - (duration * 1000);
          const ctaProgress = ctaElapsed / 3000; // 0 to 1 over 3 seconds
          
          // Background pulse effect
          const pulseValue = Math.sin(ctaProgress * Math.PI * 5) * 0.2 + 0.8;
          ctx.fillStyle = `rgba(0, 0, 0, ${pulseValue})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Gradient background
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#6d28d9');
          gradient.addColorStop(1, '#9333ea');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw attention-grabbing CTA text with animation
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Title with scale animation
          const titleScale = 1 + Math.sin(ctaProgress * Math.PI * 2) * 0.1;
          ctx.font = `bold ${titleFontSize * titleScale}px sans-serif`;
          ctx.fillStyle = 'white';
          ctx.fillText('Get Your Tattoo Today!', canvas.width / 2, canvas.height * 0.4);
          
          // CTA with highlight animation
          ctx.font = `bold ${ctaFontSize}px sans-serif`;
          const ctaY = canvas.height * 0.6;
          
          // Animated underline
          const underlineWidth = canvas.width * 0.6 * Math.min(ctaProgress * 2, 1);
          ctx.fillStyle = '#f97316';
          ctx.fillRect(
            (canvas.width - underlineWidth) / 2,
            ctaY + ctaFontSize * 0.7,
            underlineWidth,
            10
          );
          
          // CTA text
          ctx.fillStyle = '#ffffff';
          ctx.fillText('Tap to Create Your Design', canvas.width / 2, ctaY);
          
          // Draw icon
          const iconSize = ctaFontSize * 2;
          const iconY = canvas.height * 0.75;
          ctx.beginPath();
          ctx.arc(canvas.width / 2, iconY, iconSize, 0, Math.PI * 2);
          ctx.fillStyle = '#f97316';
          ctx.fill();
          
          // Draw lightning bolt icon
          ctx.beginPath();
          const boltWidth = iconSize * 0.6;
          const boltHeight = iconSize;
          // Drawing simplified bolt shape
          ctx.moveTo(canvas.width / 2 - boltWidth * 0.3, iconY - boltHeight * 0.4);
          ctx.lineTo(canvas.width / 2 + boltWidth * 0.1, iconY - boltHeight * 0.1);
          ctx.lineTo(canvas.width / 2 - boltWidth * 0.1, iconY);
          ctx.lineTo(canvas.width / 2 + boltWidth * 0.3, iconY + boltHeight * 0.4);
          ctx.lineTo(canvas.width / 2, iconY);
          ctx.lineTo(canvas.width / 2 - boltWidth * 0.2, iconY - boltHeight * 0.2);
          ctx.closePath();
          ctx.fillStyle = 'white';
          ctx.fill();
        }
        
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
    } catch (error) {
      console.error("Error creating video:", error);
      toast({
        title: "Video creation failed",
        description: "There was an error creating your video",
        variant: "destructive"
      });
      setIsCreating(false);
    }
  };

  // Download the video
  const downloadVideo = () => {
    if (!videoUrl) return;
    
    toast({
      title: "Video download started",
      description: "Your video is being downloaded",
    });
    
    // Download the video file
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `video-${Date.now()}.webm`;
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
            Transform your designs into engaging videos for social media
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <Tabs defaultValue="images" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="images" className="flex-1">
                    <Film className="mr-2 h-4 w-4" />
                    Image Slideshow
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex-1">
                    <Video className="mr-2 h-4 w-4" />
                    Background Video
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="images">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Film className="h-5 w-5" />
                      Image Slideshow Settings
                    </h3>
                    
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
                  </div>
                </TabsContent>
                
                <TabsContent value="video">
                  <BackgroundVideoSelector 
                    onSelectVideo={setSelectedBackgroundVideo}
                    selectedVideoId={selectedBackgroundVideo?.id}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="space-y-6 mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <label className="font-medium text-sm">
                    Duration: {duration} seconds (plus 3-second CTA)
                  </label>
                  <Slider
                    value={[duration]}
                    min={3}
                    max={60}
                    step={1}
                    onValueChange={(value) => setDuration(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Slide to adjust video duration (3-60 seconds)
                  </p>
                </div>
              </div>
            </div>
            
            <MusicSelector 
              onSelectSong={setSelectedSong}
              selectedSongId={selectedSong?.id}
            />
            
            <div className="glass rounded-2xl p-6">
              <VoiceOverOptions 
                duration={duration}
                onVoiceChange={setSelectedVoice}
                onScriptChange={setVoiceScript}
                onSubtitlesChange={setSubtitles}
                selectedVoiceId={selectedVoice?.id}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                onClick={createVideo}
                disabled={isCreating || ((activeTab === "images" && selectedImages.length === 0) || (activeTab === "video" && !selectedBackgroundVideo))}
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
          
          <div className="glass rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-medium mb-4">Video Preview</h3>
            
            <div className="flex-1 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
              {videoUrl ? (
                <div className="relative w-full h-full">
                  <video 
                    ref={previewVideoRef}
                    src={videoUrl} 
                    controls
                    className="w-full h-full object-contain"
                    loop
                  />
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
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={downloadVideo}
                  className="flex-1 rounded-full hover-scale"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full hover-scale"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Share link copied",
                      description: "Link to this page has been copied to clipboard",
                    });
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Hidden canvas for video generation */}
            <canvas 
              ref={canvasRef} 
              className="hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoCreator;
