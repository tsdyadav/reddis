"use server";

import { adminClient } from "@/sanity/lib/adminClient";

/**
 * Update memberCount for all communities to match actual membership data.
 * This is useful when existing memberships need to be reflected in the count.
 */
export async function fixAllCommunityMemberCounts() {
  try {
    // Get all communities
    const communities = await adminClient.fetch(
      `*[_type == "subreddit"] {
        _id,
        title,
        memberCount
      }`
    );
    
    let updatedCount = 0;
    let results = [];
    
    // Update memberCount for each community to reflect actual membership count
    for (const community of communities) {
      // For each community, count actual members
      const actualMembersCount = await adminClient.fetch(
        `count(*[_type == "communityMembership" && community._ref == $communityId])`,
        { communityId: community._id }
      );
      
      // Only update if the count is different from the actual number
      const currentCount = community.memberCount || 0;
      if (currentCount !== actualMembersCount) {
        // Set the correct member count
        await adminClient
          .patch(community._id)
          .set({ memberCount: actualMembersCount })
          .commit({ autoGenerateArrayKeys: true });
        
        updatedCount++;
        results.push({
          id: community._id,
          title: community.title,
          previousCount: currentCount,
          newCount: actualMembersCount
        });
      }
    }
    
    return {
      success: true,
      message: `Updated ${updatedCount} communities with incorrect member counts`,
      updatedCount,
      results
    };
  } catch (error) {
    console.error("Error fixing community member counts:", error);
    return {
      success: false,
      error: "Failed to fix community member counts"
    };
  }
}

/**
 * Fix memberCount for a specific community.
 */
export async function fixCommunityMemberCount(communityId: string) {
  try {
    // Get the current community info
    const community = await adminClient.fetch(
      `*[_type == "subreddit" && _id == $communityId][0] {
        _id,
        title,
        memberCount
      }`,
      { communityId }
    );
    
    if (!community) {
      return {
        success: false,
        error: `Community with ID ${communityId} not found`
      };
    }
    
    // Count actual members
    const actualMembersCount = await adminClient.fetch(
      `count(*[_type == "communityMembership" && community._ref == $communityId])`,
      { communityId }
    );
    
    const currentCount = community.memberCount || 0;
    
    // Set the correct member count
    await adminClient
      .patch(communityId)
      .set({ memberCount: actualMembersCount })
      .commit({ autoGenerateArrayKeys: true });
    
    return {
      success: true,
      message: `Updated memberCount for community "${community.title}" from ${currentCount} to ${actualMembersCount}`,
      communityId,
      communityTitle: community.title,
      previousCount: currentCount,
      newCount: actualMembersCount
    };
  } catch (error) {
    console.error(`Error fixing member count for community ${communityId}:`, error);
    return {
      success: false,
      error: `Failed to fix member count for community ${communityId}`
    };
  }
} 