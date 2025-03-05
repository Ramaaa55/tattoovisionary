
import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ImageGenerator from '@/components/ImageGenerator';
import VideoCreator from '@/components/VideoCreator';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { Image } from '@/types';

const Index = () => {
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Placeholder for the image selection logic
  // In a real app, this would handle the selection of images from the image generator
  useEffect(() => {
    // This is a simulation - normally this would be connected
    // to the actual image generator component
    const handleSelectedImagesChange = (images: string[]) => {
      // Convert the image URLs to Image objects
      const imageObjects: Image[] = images.map(url => ({
        url,
        prompt: "Selected tattoo design",
        timestamp: Date.now()
      }));
      
      setSelectedImages(imageObjects);
    };
    
    // Set up a global event or state management
    // to connect the image generator and video creator
    // This is simplified for the example
    window.addEventListener('imagesSelected', (e: any) => {
      handleSelectedImagesChange(e.detail);
    });
    
    return () => {
      window.removeEventListener('imagesSelected', (e: any) => {
        handleSelectedImagesChange(e.detail);
      });
    };
  }, []);
  
  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-pulse-soft">
          <span className="text-2xl font-medium">tattoovisionary</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="animate-blur-in">
        <Hero />
        <ImageGenerator />
        <VideoCreator selectedImages={selectedImages} />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
