import { sanityFetch } from "../live";
import { defineQuery } from "groq";

// This query fetches posts and orders them by score
// It includes fields necessary for the Post component and for ranking
const getPopularPostsQuery = defineQuery(`
  *[_type == "post" && isDeleted != true && defined(upvoteCount)] {
    _id,
    title,
    "slug": slug.current,
    body,
    publishedAt,
    "author": author-> {
      _id,
      username,
      imageUrl
    },
    "subreddit": subreddit-> {
      _id,
      title,
      "slug": slug.current,
      image
    },
    image,
    upvoteCount,
    downvoteCount,
    commentCount,
    score,
    isDeleted
  } | order(upvoteCount desc)
`);

export async function getPopularPosts() {
  try {
    const posts = await sanityFetch({ query: getPopularPostsQuery });
    return posts.data || []; // Ensure an array is always returned
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return []; // Return empty array on error
  }
} 