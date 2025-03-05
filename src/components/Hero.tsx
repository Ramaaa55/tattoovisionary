
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useInView } from '@/utils/animations';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { threshold: 0.1 });
  
  return (
    <section 
      ref={heroRef}
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary/5 to-primary/10 blur-3xl animate-spin-slow" />
        <div className="absolute top-[60%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-primary/5 to-primary/10 blur-3xl animate-float" />
      </div>
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className={`inline-block mb-6 px-4 py-1.5 rounded-full glass ${isInView ? 'animate-fade-in' : 'opacity-0'}`}>
            <span className="text-sm font-medium">Your AI tattoo artist</span>
          </div>
          
          <h1 
            className={`text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6 ${
              isInView ? 'animate-scale-in' : 'opacity-0'
            }`}
          >
            Turn your ideas into <br />
            <span className="text-gradient">stunning tattoo designs</span>
          </h1>
          
          <p 
            className={`text-lg md:text-xl text-foreground/70 mb-8 max-w-2xl ${
              isInView ? 'animate-fade-in delay-[200ms]' : 'opacity-0'
            }`}
          >
            Generate unique tattoo concepts in seconds using our AI-powered design tool, 
            and create eye-catching videos to showcase your ideas.
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row gap-4 ${
              isInView ? 'animate-fade-in delay-[400ms]' : 'opacity-0'
            }`}
          >
            <Button 
              size="lg" 
              className="rounded-full px-8 hover-scale font-medium"
            >
              Create Your Design
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-8 hover-scale font-medium"
            >
              See Examples
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
