import { sanityFetch } from "../live";
import { groq } from "next-sanity";

// Helper to prepare search terms for GROQ's match operator
// It splits the query into terms and adds a wildcard to each for partial matching.
// e.g., "my search" -> ["my*", "search*"]
const prepareSearchTerms = (query: string): string[] => {
  return query.toLowerCase().split(' ').filter(term => term.trim() !== '').map(term => term + '**');
}

export async function universalSearch(query: string) {
  if (!query || query.trim() === "") {
    return { communities: [], posts: [], users: [] };
  }

  const searchTerms = prepareSearchTerms(query);
  const termsConditions = (fields: string[]) => fields.map(field => searchTerms.map(term => `${field} match ${JSON.stringify(term)}`).join(' || ')).join(' || ');

  const communitiesQuery = groq`
    *[_type == "subreddit" && (
      ${termsConditions(['title', 'description'])}
    )] | score(
      ${termsConditions(['title', 'description'])}
    ) | order(score desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      // Add other fields you want to display for communities
    }
  `;

  const postsQuery = groq`
    *[_type == "post" && !isDeleted && (
      ${termsConditions(['title', 'pt::text(body)'])}
    )] | score(
      ${termsConditions(['title', 'pt::text(body)'])}
    ) | order(score desc) {
      _id,
      title,
      "slug": slug.current, // Ensure this is selected
      "communitySlug": subreddit->slug.current,
      "communityTitle": subreddit->title, // Added for context
      "authorUsername": author->username,
      "authorImage": author->image, // Added for potential display
      publishedAt,
      "excerpt": pt::text(body)
    }
  `;

  // Note: Searching users might have privacy implications. 
  // Ensure this aligns with your application's privacy policy.
  // For now, let's assume username is public and searchable.
  const usersQuery = groq`
    *[_type == "user" && (
      ${termsConditions(['username', 'name'])}
    )] | score(
      ${termsConditions(['username', 'name'])}
    ) | order(score desc) {
      _id,
      username,
      name,
      image
      // Add other fields you want to display for users
    }
  `;

  const params = { }; // No specific params other than what's embedded in query strings

  try {
    const [communitiesResult, postsResult, usersResult] = await Promise.all([
      sanityFetch({ query: communitiesQuery, params, tags: ['subreddit', 'post', 'user'] }),
      sanityFetch({ query: postsQuery, params, tags: ['post', 'user', 'subreddit'] }), // Ensure tags cover related data
      sanityFetch({ query: usersQuery, params, tags: ['user'] })
    ]);

    return {
      communities: communitiesResult.data || [],
      posts: postsResult.data || [],
      users: usersResult.data || [],
    };
  } catch (error) {
    console.error("Error during universal search:", error);
    return { communities: [], posts: [], users: [] }; // Return empty on error
  }
}

// Example of how a post slug might be defined in postType.ts if not already present:
// defineField({
//   name: 'slug',
//   title: 'Slug',
//   type: 'slug',
//   options: {
//     source: 'title',
//     maxLength: 96,
//   },
//   validation: (rule) => rule.required(),
// }), 