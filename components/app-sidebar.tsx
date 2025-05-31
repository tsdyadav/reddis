import * as React from "react";
import { ChevronDownIcon, ChevronRightIcon, FlameIcon, HomeIcon, Minus, Plus, TrendingUpIcon, UsersIcon } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import ReddishLogo from "@/images/Reddish Full.png";
import Link from "next/link";
import { getSubreddits } from "@/sanity/lib/subreddit/getSubreddits";
import CreateCommunityButton from "./header/CreateCommunityButton";
import { getUserJoinedCommunities } from "@/sanity/lib/user/getUserCommunities";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { urlFor } from "@/sanity/lib/image";

// Simplified shape for a Sanity slug object if it's not just a string
interface SanitySlugShape {
  current?: string;
  _type?: string; // Optional, but often present
}

// Define the Subreddit type
interface Subreddit {
  _id: string;
  title?: string;
  slug?: string | SanitySlugShape | null;
  description?: string;
  image?: SanityImageSource;
  memberCount?: number;
}

// User's joined community type structure
interface UserCommunity {
  _id: string;
  title?: string;
  slug?: string | SanitySlugShape | null;
  image?: SanityImageSource;
  memberCount?: number;
}

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const subredditsData = await getSubreddits() || [];
  const userCommunitiesResult = await getUserJoinedCommunities();
  const userCommunitiesData = ("communities" in userCommunitiesResult 
    ? userCommunitiesResult.communities 
    : []) || [];

  // Cast after fetching, acknowledging potential discrepancies with precise generated types
  const subreddits = subredditsData as Subreddit[];
  const userCommunities = userCommunitiesData as UserCommunity[];

  const userCommunityIds = new Set(
    userCommunities.map((community) => community._id)
  );

  // Filter out joined communities from the general subreddits list for the "Browse All" section
  const browseCommunities = subreddits.filter(
    (subreddit) => !userCommunityIds.has(subreddit._id)
  );

  const getSlugString = (slug: string | SanitySlugShape | null | undefined): string | null => {
    if (!slug) return null;
    if (typeof slug === 'string') return slug;
    if (typeof slug === 'object' && typeof slug.current === 'string') return slug.current;
    return null;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src={ReddishLogo}
                  alt="logo"
                  width={150}
                  height={150}
                  className="object-contain transition-opacity duration-300"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <CreateCommunityButton />
              </SidebarMenuButton>

              <SidebarMenuButton asChild>
                <Link 
                  href="/?sort=new" 
                  className="flex items-center p-2 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  <span>Home</span>
                  <span className="text-xs text-muted-foreground ml-auto dark:text-gray-400">New</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton asChild>
                <Link 
                  href="/?sort=popular" 
                  className="flex items-center p-2 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700"
                >
                  <TrendingUpIcon className="w-4 h-4 mr-2" />
                  <span>Popular</span>
                  <span className="text-xs text-muted-foreground ml-auto dark:text-gray-400">Most liked</span>
                </Link>
              </SidebarMenuButton>
              
              <SidebarMenuButton asChild>
                <Link 
                  href="/?sort=hot" 
                  className="flex items-center p-2 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700"
                >
                  <FlameIcon className="w-4 h-4 mr-2" />
                  <span>Hot</span>
                  <span className="text-xs text-muted-foreground ml-auto dark:text-gray-400">Most commented</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <Collapsible
              key="communities-collapsible"
              // Default open if user has communities or if there are communities to browse
              defaultOpen={userCommunities.length > 0 || browseCommunities.length > 0}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <span className="flex items-center">
                      <UsersIcon className="w-4 h-4 mr-2" />
                      Communities
                    </span>
                    <ChevronRightIcon className="ml-auto h-4 w-4 group-data-[state=open]/collapsible:hidden" />
                    <ChevronDownIcon className="ml-auto h-4 w-4 group-data-[state=closed]/collapsible:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {/* My Communities Section */}
                    {userCommunities.length > 0 && (
                      <>
                        {userCommunities.map((community) => {
                          const communitySlugString = getSlugString(community.slug);
                          return (
                            <SidebarMenuSubItem key={community._id}>
                              <SidebarMenuSubButton asChild isActive={false /* Add active state logic if needed */}>
                                <Link href={communitySlugString ? `/community/${communitySlugString}` : '#'} className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2 border border-border">
                                    {community.image ? (
                                      <AvatarImage 
                                        src={urlFor(community.image).width(24).height(24).fit("crop").url()}
                                        alt={community.title || 'community avatar'}
                                        className="object-cover"
                                      />
                                    ) : null}
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                      {community.title?.charAt(0).toUpperCase() || 'C'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="flex-1 truncate">{community.title || 'Unnamed Community'}</span>
                                  {(community.memberCount ?? 0) > 0 && (
                                    <Badge variant="outline" className="text-xs text-muted-foreground ml-2 px-1.5 py-0">
                                      {community.memberCount} {(community.memberCount ?? 0) === 1 ? 'member' : 'members'}
                                    </Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </>
                    )}

                    {/* Browse All Communities Section */}
                    {browseCommunities.length > 0 && (
                      <>
                        {/* Optional: Add a divider or header if both sections are present and need separation */}
                        {userCommunities.length > 0 && browseCommunities.length > 0 && (
                           <div className="my-2 border-t border-border" /> // Simple divider
                        )}
                         <p className="px-4 py-2 text-xs text-muted-foreground">Browse All</p>
                        {browseCommunities.map((subreddit) => {
                          const subredditSlugString = getSlugString(subreddit.slug);
                          return (
                            <SidebarMenuSubItem key={subreddit._id}>
                              <SidebarMenuSubButton asChild isActive={false /* Add active state logic if needed */}>
                                <Link href={subredditSlugString ? `/community/${subredditSlugString}` : '#'} className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2 border border-border">
                                     {subreddit.image ? (
                                      <AvatarImage 
                                        src={urlFor(subreddit.image).width(24).height(24).fit("crop").url()}
                                        alt={subreddit.title || 'community avatar'}
                                        className="object-cover"
                                      />
                                    ) : null}
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                      {subreddit.title?.charAt(0).toUpperCase() || 'C'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="flex-1 truncate">{subreddit.title || 'Unnamed Community'}</span>
                                  {(subreddit.memberCount ?? 0) > 0 && (
                                    <Badge variant="outline" className="text-xs text-muted-foreground ml-2 px-1.5 py-0">
                                      {subreddit.memberCount} {(subreddit.memberCount ?? 0) === 1 ? 'member' : 'members'}
                                    </Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </>
                    )}
                    
                    {/* No communities at all */}
                    {userCommunities.length === 0 && browseCommunities.length === 0 && (
                       <div className="px-4 py-3 text-sm text-muted-foreground">
                        No communities found.
                      </div>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
