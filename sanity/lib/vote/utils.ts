import { defineQuery } from "next-sanity";
import { adminClient } from "../adminClient";
import { sanityFetch } from "../live";

/**
 * Updates the denormalized vote counts (upvoteCount, downvoteCount, score)
 * and controversyScore on a given post document.
 * Should be called after any vote change (create, update, delete vote document).
 */
export async function updatePostCalculatedFields(postId: string) {
  // 1. Get all votes for the post
  const postVotesQuery = defineQuery(
    `*[_type == "vote" && post._ref == $postId]`
  );
  const votesData = await sanityFetch({ query: postVotesQuery, params: { postId } });
  const votes = votesData.data || [];

  // 2. Calculate counts
  let upvoteCount = 0;
  let downvoteCount = 0;
  votes.forEach((vote: any) => {
    if (vote.voteType === "upvote") {
      upvoteCount++;
    }
    if (vote.voteType === "downvote") {
      downvoteCount++;
    }
  });

  // 3. Calculate score
  const score = upvoteCount - downvoteCount;

  // 5. Patch the post document
  try {
    await adminClient
      .patch(postId)
      .set({
        upvoteCount: upvoteCount,
        downvoteCount: downvoteCount,
        score: score,
      })
      .commit({ autoGenerateArrayKeys: true });
    console.log(`Post ${postId} counts updated: Up ${upvoteCount}, Down ${downvoteCount}, Score ${score}`);
  } catch (error) {
    console.error(`Failed to update counts for post ${postId}:`, error);
  }
} 