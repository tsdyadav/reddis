"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon } from "lucide-react";
import Link from "next/link";
import JoinCommunityButton from "./JoinCommunityButton";
import { useEffect } from "react";
import { useMemberCount } from "@/context/MemberCountContext";

interface CommunityCardProps {
  community: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    image?: string;
    memberCount?: number;
  };
  isMember?: boolean;
  className?: string;
}

export function CommunityCard({ community, isMember = false, className = "" }: CommunityCardProps) {
  // Get the member count context and initialize it with the current community
  const { getMemberCount, updateMemberCount } = useMemberCount();
  
  // Initialize the context with the current community's member count
  useEffect(() => {
    if (community._id && community.memberCount !== undefined) {
      updateMemberCount(community._id, community.memberCount);
    }
    // Only re-run if the community ID or memberCount changes, NOT when updateMemberCount changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community._id, community.memberCount]);
  
  // Get the current member count from the context
  const memberCount = getMemberCount(community._id);
  
  return (
    <Card className={`w-full community-card ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={community.image} alt={community.title} />
            <AvatarFallback>
              {community.title.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">
              <Link href={`/community/${community.slug}`} className="hover:underline">
                {community.title}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center text-xs">
              <UsersIcon className="h-3 w-3 mr-1" />
              {memberCount} {(memberCount === 1) ? 'member' : 'members'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {community.description && (
        <CardContent className="pb-2 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {community.description}
          </p>
        </CardContent>
      )}
      <CardFooter className="pt-0">
        <JoinCommunityButton 
          communityId={community._id} 
          initialIsMember={isMember}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}