"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import JoinCommunityButton from "./JoinCommunityButton";
import { UsersIcon } from "lucide-react";
import { FixMemberCountsButton } from '../admin/FixMemberCountsButton';
import { useUser } from '@clerk/nextjs';
import { useMemberCount } from '@/context/MemberCountContext';

interface CommunityBannerProps {
  community: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    memberCount?: number;
  };
  isMember: boolean;
  imageUrl?: string;
  imageAlt?: string;
}

export function CommunityBanner({ 
  community, 
  isMember, 
  imageUrl, 
  imageAlt 
}: CommunityBannerProps) {
  const { user } = useUser();
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
  
  // Handle membership change to update the count in UI
  const handleMembershipChange = (newIsMember: boolean) => {
    // The context will handle the update through the JoinCommunityButton
  };

  // Check if the user is an admin (for development purposes, you can customize this check)
  const isAdmin = user && (
    user.primaryEmailAddress?.emailAddress?.includes('@admin') || 
    user.primaryEmailAddress?.emailAddress === 'admin@example.com'
  );

  return (
    <section className="bg-card border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {imageUrl && (
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border">
                <Image
                  src={imageUrl}
                  alt={imageAlt || "Community icon"}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{community.title}</h1>
                {isAdmin && (
                  <FixMemberCountsButton communityId={community._id} />
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <UsersIcon className="h-4 w-4 mr-1" />
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </div>
              {community.description && (
                <p className="text-sm text-muted-foreground mt-1">{community.description}</p>
              )}
            </div>
          </div>
          
          <div className="hidden md:block">
            <JoinCommunityButton 
              communityId={community._id} 
              initialIsMember={isMember}
              size="lg"
              onMembershipChange={handleMembershipChange}
            />
          </div>
        </div>
        
        <div className="mt-4 md:hidden">
          <JoinCommunityButton 
            communityId={community._id} 
            initialIsMember={isMember}
            className="w-full"
            onMembershipChange={handleMembershipChange}
          />
        </div>
      </div>
    </section>
  );
} 