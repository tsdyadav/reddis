"use server";

import { adminClient } from "@/sanity/lib/adminClient";
import { getUser } from "./getUser";

export async function getUserJoinedCommunities() {
  try {
    const user = await getUser();
    if ("error" in user) return { error: "User not authenticated" };
    
    const userId = user._id;

    const memberships = await adminClient.fetch(
      `*[_type == "communityMembership" && user._ref == $userId]{
        _id,
        community->{
          _id,
          title,
          slug,
          image,
          memberCount,
          description
        }
      }`,
      { userId },
      { cache: "no-store" }
    );

    return { communities: memberships.map((m: any) => m.community) };
  } catch (error) {
    console.error("Error fetching user communities:", error);
    return { error: "Failed to fetch user communities" };
  }
}