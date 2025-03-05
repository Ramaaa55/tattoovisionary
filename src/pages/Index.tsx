
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
  
  // Set up a handler to receive selected images from the ImageGenerator
  const handleImagesSelected = (images: Image[]) => {
    setSelectedImages(images);
    
    // Scroll to video creator after selecting images
    setTimeout(() => {
      document.getElementById('video-creator')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };
  
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
        <ImageGenerator onSelectImages={handleImagesSelected} />
        <VideoCreator selectedImages={selectedImages} />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
