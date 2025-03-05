
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <a 
          href="#" 
          className="text-xl font-medium tracking-tight hover:opacity-80 transition-opacity"
        >
          tattoovisionary
        </a>
        
        <nav className="hidden md:flex items-center gap-8">
          <NavLinks />
          <Button className="rounded-full hover-scale">
            Try App
          </Button>
        </nav>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-background z-50 md:hidden transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="container flex flex-col gap-8 pt-20 pb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="flex flex-col gap-6">
            <NavLinks mobile onClick={() => setIsMobileMenuOpen(false)} />
          </div>
          
          <Button className="rounded-full w-full">
            Try App
          </Button>
        </div>
      </div>
    </header>
  );
};

const NavLinks = ({ mobile = false, onClick = () => {} }: { mobile?: boolean; onClick?: () => void }) => {
  const links = [
    { name: "Home", href: "#" },
    { name: "Generator", href: "#generator" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
  ];
  
  return (
    <>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className={cn(
            "text-foreground/80 hover:text-foreground transition-colors",
            mobile ? "text-2xl py-2" : ""
          )}
          onClick={onClick}
        >
          {link.name}
        </a>
      ))}
    </>
  );
};

export default Navbar;
