"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommunityCard } from "./CommunityCard";
import { Button } from "../ui/button";
import { useTheme } from "../ThemeProvider";
import { useEffect, useState } from "react";

interface Community {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  memberCount: number;
}

interface CommunitySidebarProps {
  communities: Community[];
  userCommunityIds: Set<string> | string[] | Set<unknown>;
}

export function CommunitySidebar({ communities, userCommunityIds }: CommunitySidebarProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="sticky top-4 space-y-4">
      <Card className="community-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Top Communities</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => window.location.href = "/communities"}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {communities?.map((community) => (
            <CommunityCard 
              key={community._id}
              community={community}
              isMember={
                userCommunityIds instanceof Set 
                  ? userCommunityIds.has(community._id) 
                  : Array.isArray(userCommunityIds) && userCommunityIds.includes(community._id)
              }
              className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            />
          ))}
        </CardContent>
      </Card>
      
      <Card className="community-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Create Your Own Community</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Start your own community and connect with people who share your interests.
          </p>
          <Button 
            className="w-full"
            onClick={() => {
              const createCommunityButton = document.querySelector('[data-create-community-button]');
              if (createCommunityButton) {
                (createCommunityButton as HTMLButtonElement).click();
              }
            }}
          >
            Create Community
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}