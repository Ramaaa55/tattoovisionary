
import { Instagram, Twitter, Facebook, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="py-12 md:py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">tattoovisionary</h3>
            <p className="text-primary-foreground/80">
              Transform your ideas into stunning tattoo designs with our AI-powered platform.
            </p>
            <div className="flex gap-3">
              <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Youtube className="h-4 w-4" />} />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="#">Home</FooterLink>
              <FooterLink href="#generator">Generator</FooterLink>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#about">About</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">FAQ</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact Us</h4>
            <p className="text-primary-foreground/80 mb-4">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <Button 
              variant="secondary" 
              className="rounded-full hover-scale px-6"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-primary-foreground/20 text-center text-primary-foreground/70">
          <p>© {year} tattoovisionary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => {
  return (
    <a 
      href={href} 
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
    >
      {icon}
    </a>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <li>
      <a 
        href={href} 
        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
      >
        {children}
      </a>
    </li>
  );
};

export default Footer;
