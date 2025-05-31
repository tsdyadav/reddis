import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getSubredditBySlug(slug: string) {
  const lowerCaseSlug = slug.toLowerCase();
  const getSubredditBySlugQuery =
    defineQuery(`*[_type == "subreddit" && slug.current == $slug][0] {
      _id,
      title,
      description,
      "slug": slug.current,
      image,
      memberCount,
      createdAt,
      "moderator": moderator->,
    }`);

  const subreddit = await sanityFetch({
    query: getSubredditBySlugQuery,
    params: { slug: lowerCaseSlug }
  });

  return subreddit.data;
}
