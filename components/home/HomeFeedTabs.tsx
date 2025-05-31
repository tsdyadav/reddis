import Link from "next/link";
import { Button } from "../ui/button";
import { FlameIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HomeFeedTabsProps {
  currentSort?: string;
}

export function HomeFeedTabs({ currentSort = "new" }: HomeFeedTabsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 mb-4 p-2 bg-card rounded-lg dark:bg-gray-800 dark:border dark:border-gray-700 transition-all duration-300">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/?sort=new" className="w-full">
              <Button
                variant={currentSort === "new" ? "default" : "ghost"}
                size="sm"
                className={`flex items-center gap-1 w-full transition-all duration-300 ${
                  currentSort === "new" 
                    ? "dark:bg-blue-600 dark:text-white" 
                    : "dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <SparklesIcon className="h-4 w-4" />
                <span>New</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Latest posts from all communities</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/?sort=hot" className="w-full">
              <Button
                variant={currentSort === "hot" ? "default" : "ghost"}
                size="sm"
                className={`flex items-center gap-1 w-full transition-all duration-300 ${
                  currentSort === "hot" 
                    ? "dark:bg-blue-600 dark:text-white" 
                    : "dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <FlameIcon className="h-4 w-4" />
                <span>Hot</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Most commented posts</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/?sort=popular" className="w-full">
              <Button
                variant={currentSort === "popular" ? "default" : "ghost"}
                size="sm"
                className={`flex items-center gap-1 w-full transition-all duration-300 ${
                  currentSort === "popular" 
                    ? "dark:bg-blue-600 dark:text-white" 
                    : "dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <TrendingUpIcon className="h-4 w-4" />
                <span>Popular</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Most liked posts</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}