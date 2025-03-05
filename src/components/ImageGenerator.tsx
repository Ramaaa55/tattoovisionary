
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Image as ImageIcon, RefreshCw, Download, Check, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Image } from '@/types';

interface ImageGeneratorProps {
  onSelectImages?: (images: Image[]) => void;
}

const ImageGenerator = ({ onSelectImages }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle image generation using Pollinations API
  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe the tattoo design you want to generate",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);

    try {
      // Using Pollinations API to generate images
      const formattedPrompt = encodeURIComponent(`tattoo design, ${prompt}, detailed, high quality`);
      const imageUrl = `https://image.pollinations.ai/prompt/${formattedPrompt}`;
      
      // Add a cache buster to force a new image
      const timestampedUrl = `${imageUrl}?seed=${Date.now()}`;
      
      // Simulate loading delay (in a real app, the API would have its own processing time)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newImage: Image = {
        url: timestampedUrl,
        prompt: prompt,
        timestamp: Date.now()
      };

      setImages(prev => [newImage, ...prev].slice(0, 9)); // Keep only the last 9 images
      setPrompt('');
      
      toast({
        title: "Image generated!",
        description: "Your tattoo design is ready",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your image",
        variant: "destructive"
      });
      console.error("Error generating image:", error);
    } finally {
      setGenerating(false);
    }
  };

  // Toggle image selection
  const toggleImageSelection = (imageTimestamp: number) => {
    setSelectedImageIds(prev => {
      const timestampStr = imageTimestamp.toString();
      if (prev.includes(timestampStr)) {
        return prev.filter(id => id !== timestampStr);
      } else {
        return [...prev, timestampStr];
      }
    });
  };

  // Get selected images as objects
  const getSelectedImages = (): Image[] => {
    return images.filter(img => selectedImageIds.includes(img.timestamp.toString()));
  };

  // Download image
  const downloadImage = async (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `tattoo-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your image",
        variant: "destructive"
      });
    }
  };
  
  // Create video with selected images
  const handleCreateVideo = () => {
    if (selectedImageIds.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to create a video",
        variant: "destructive"
      });
      return;
    }
    
    const selectedImagesData = getSelectedImages();
    if (onSelectImages) {
      onSelectImages(selectedImagesData);
    }
  };

  return (
    <section id="generator" className="py-20 md:py-24">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Generate Your Tattoo Design
          </h2>
          <p className="text-foreground/70 text-lg">
            Describe your ideal tattoo and let our AI bring it to life. Select images to create videos.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8 max-w-3xl mx-auto mb-12">
          <div className="flex gap-3">
            <Input
              placeholder="Describe your tattoo design..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="rounded-full bg-white"
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
            />
            <Button 
              onClick={generateImage} 
              disabled={generating || !prompt.trim()}
              className="rounded-full px-6 hover-scale"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        <div ref={containerRef} className="relative">
          {selectedImageIds.length > 0 && (
            <div className="sticky top-20 z-20 bg-white/80 backdrop-blur-sm py-4 border-b">
              <div className="container">
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {selectedImageIds.length} image{selectedImageIds.length > 1 ? 's' : ''} selected
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedImageIds([])}
                      className="rounded-full"
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full"
                      onClick={handleCreateVideo}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Create Video
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => {
                const isSelected = selectedImageIds.includes(image.timestamp.toString());
                return (
                  <div 
                    key={image.timestamp} 
                    className={`relative group rounded-2xl overflow-hidden border shadow-sm hover-scale cursor-pointer ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => toggleImageSelection(image.timestamp)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      <img 
                        src={image.url} 
                        alt={image.prompt}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      
                      {/* Image overlay with actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-sm mb-3 line-clamp-2">{image.prompt}</p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="secondary"
                              className="rounded-full"
                              onClick={(e) => downloadImage(image.url, e)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              className="rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrompt(image.prompt);
                              }}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Remix
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">No designs yet</h3>
              <p className="text-muted-foreground">
                Your generated tattoo designs will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageGenerator;
