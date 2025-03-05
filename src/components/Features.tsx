
import { useRef } from 'react';
import { Wand2, Video, Palette, Share2, Shield, Zap } from 'lucide-react';
import { useInView, getAnimationClass } from '@/utils/animations';

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef, { threshold: 0.1 });

  const features = [
    {
      icon: <Wand2 className="h-10 w-10" />,
      title: "AI-Powered Design",
      description: "Generate unique tattoo concepts instantly with our advanced AI algorithm."
    },
    {
      icon: <Video className="h-10 w-10" />,
      title: "Video Creation",
      description: "Transform your designs into engaging videos for social media with trending music."
    },
    {
      icon: <Palette className="h-10 w-10" />,
      title: "Style Customization",
      description: "Adjust styles, colors, and details to perfectly match your vision."
    },
    {
      icon: <Share2 className="h-10 w-10" />,
      title: "Easy Sharing",
      description: "Share your creations directly to social media platforms with one click."
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Copyright Safe",
      description: "All generated designs are original and available for commercial use."
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: "Lightning Fast",
      description: "Get high-quality results in seconds, not minutes or hours."
    }
  ];

  return (
    <section id="features" className="py-20 md:py-24">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-foreground/70 text-lg">
            Everything you need to create, customize, and share stunning tattoo designs
          </p>
        </div>

        <div 
          ref={featuresRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10"
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`${getAnimationClass(isInView, 'fade-in', 100 * index)} flex flex-col items-start`}
            >
              <div className="p-4 rounded-xl bg-primary/5 text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
