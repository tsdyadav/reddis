import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "../ThemeProvider";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 600); // Animation duration
  };
  
  if (!mounted) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            className={`w-9 h-9 relative overflow-hidden transition-all duration-300 ${
              isAnimating ? 'scale-110' : ''
            } ${theme === 'dark' 
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600' 
              : 'bg-white hover:bg-gray-100'
            }`}
            data-theme={theme}
          >
            {/* Sun icon with rays animation */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              theme === 'dark' ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'
            }`}>
              <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
              {/* Animated rays */}
              {[...Array(8)].map((_, i) => (
                <span 
                  key={i}
                  className={`absolute w-[2px] h-[6px] bg-yellow-500 rounded-full transform transition-all duration-500 ${
                    theme === 'dark' ? 'scale-0' : 'scale-100'
                  }`}
                  style={{ 
                    transform: `rotate(${i * 45}deg) translateY(-8px)`,
                    opacity: theme === 'dark' ? 0 : 0.8
                  }}
                />
              ))}
            </div>
            
            {/* Moon icon with stars animation */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-90'
            }`}>
              <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
              {/* Animated stars */}
              {[...Array(3)].map((_, i) => (
                <span 
                  key={i}
                  className={`absolute w-[2px] h-[2px] bg-blue-200 rounded-full transform transition-all duration-500 ${
                    theme === 'dark' ? 'scale-100' : 'scale-0'
                  }`}
                  style={{ 
                    top: `${5 + i * 5}px`, 
                    left: `${10 + i * 3}px`,
                    opacity: theme === 'dark' ? (0.5 + i * 0.2) : 0
                  }}
                />
              ))}
            </div>
            
            <span className="sr-only">Toggle theme</span>
            
            {/* Background glow effect */}
            <span className={`absolute inset-0 transition-all duration-500 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-100' 
                : 'bg-gradient-to-br from-yellow-200/20 to-orange-200/20 opacity-0'
            }`}></span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 