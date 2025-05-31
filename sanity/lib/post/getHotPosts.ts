import { sanityFetch } from "../live";
import { defineQuery } from "groq";

// This query fetches posts from the last 7 days, ordered by score
const getHotPostsQuery = defineQuery(`
  *[_type == "post" && 
    isDeleted != true && 
    defined(commentCount) && 
    publishedAt > now() - 60*60*24*7 // 7 days ago in seconds
  ] {
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
  } | order(commentCount desc)
`);

export async function getHotPosts() {
  try {
    const posts = await sanityFetch({ query: getHotPostsQuery });
    return posts.data || []; // Ensure an array is always returned
  } catch (error) {
    console.error("Error fetching hot posts:", error);
    return []; // Return empty array on error
  }
} 