import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getPosts(sort: string = 'new') {
  try {
    // Define sort order based on parameter
    let sortOrder = '';
    let additionalFilter = '';
    
    switch(sort) {
      case 'hot':
        // Sort by a combination of recency and comment count
        // In a real app, this would be more sophisticated
        additionalFilter = '| score(now() - publishedAt < 60*60*24*7)'; // Boost posts from last week
        sortOrder = 'order(count(comments) desc, publishedAt desc)';
        break;
      case 'popular':
        // Sort by popularity (most votes)
        // In a real app, this would use an aggregated vote count
        additionalFilter = '| score(count(votes) > 0 ? count(votes) : 0)'; // Score by vote count
        sortOrder = 'order(score desc, publishedAt desc)';
        break;
      case 'new':
      default:
        // Sort by newest first
        sortOrder = 'order(publishedAt desc, _createdAt desc)';
        break;
    }
    
    const getAllPostsQuery =
      defineQuery(`*[_type == "post" && isDeleted != true] {
      _id,
      title,
      "slug": slug.current,
      body,
      publishedAt,
      "author": author->,
      "subreddit": subreddit->,
      image,
      isDeleted,
      "commentCount": count(*[_type == "comment" && references(^._id)]),
      "voteCount": count(*[_type == "vote" && references(^._id)])
    } ${additionalFilter} | ${sortOrder}`);

    const posts = await sanityFetch({ query: getAllPostsQuery });
    return posts.data || []; // Ensure we always return an array
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []; // Return empty array on error
  }
}
