import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getSubreddits() {
  const getSubredditsQuery = defineQuery(`*[_type == "subreddit"] {
        _id,
        title,
        "slug": slug.current,
        description,
        image,
        memberCount,
        createdAt,
        "moderator": moderator->,
      } | order(createdAt desc)`);

  // Fetch data with no cache option
  const subreddits = await sanityFetch({ 
    query: getSubredditsQuery
  });

  return subreddits.data;
}
