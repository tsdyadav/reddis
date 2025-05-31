import {
  GetAllPostsQueryResult,
  GetPostsForSubredditQueryResult,
} from "@/sanity.types";
import { getPostComments } from "@/sanity/lib/vote/getPostComments";
import { getPostVotes } from "@/sanity/lib/vote/getPostVotes";
import { getUserPostVoteStatus } from "@/sanity/lib/vote/getUserPostVoteStatus";
import TimeAgo from "../TimeAgo";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { MessageSquare } from "lucide-react";
import CommentInput from "../comment/CommentInput";
import CommentList from "../comment/CommentList";
import PostVoteButtons from "./PostVoteButtons";
import ReportButton from "../ReportButton";
import DeleteButton from "../DeleteButton";

interface PostProps {
  post:
    | GetAllPostsQueryResult[number]
    | GetPostsForSubredditQueryResult[number];
  userId: string | null;
}

async function Post({ post, userId }: PostProps) {
  try {
    if (!post || !post._id) {
      return (
        <div className="p-4 bg-card rounded-md border border-border">
          <p className="text-muted-foreground">This post is unavailable</p>
        </div>
      );
    }

    const votes = await getPostVotes(post._id);
    const vote = await getUserPostVoteStatus(post._id, userId);
    const comments = await getPostComments(post._id, userId);

    return (
      <article
        key={post._id}
        className="relative bg-card text-card-foreground rounded-md shadow-sm border border-border hover:border-accent transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500 dark:text-gray-100 post-card"
        data-theme="auto"
      >
        <div className="flex">
          {/* Vote Buttons */}
          <PostVoteButtons
            contentId={post._id}
            votes={votes}
            vote={vote}
            contentType="post"
          />

          {/* Post Content */}
          <div className="flex-1 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              {post.subreddit && (
                <>
                  <a
                    href={`/community/${post.subreddit.slug}`}
                    className="font-medium hover:underline"
                  >
                    c/{post.subreddit.title}
                  </a>
                  <span>•</span>
                  <span>Posted by</span>
                  {post.author && (
                    <a
                      href={`/u/${post.author.username}`}
                      className="hover:underline"
                    >
                      u/{post.author.username}
                    </a>
                  )}
                  <span>•</span>
                  {post.publishedAt && (
                    <TimeAgo date={new Date(post.publishedAt)} />
                  )}
                </>
              )}
            </div>

            {post.subreddit && (
              <div>
                <h2 className="text-lg font-medium text-foreground mb-2">
                  {post.title}
                </h2>
              </div>
            )}

            {post.body && post.body[0]?.children?.[0]?.text && (
              <div className="prose prose-sm max-w-none text-muted-foreground mb-3 dark:prose-invert dark:text-gray-300">
                {post.body[0].children[0].text}
              </div>
            )}

            {post.image && post.image.asset?._ref && (
              <div className="relative w-full h-64 mb-3 px-2 bg-muted/30 dark:bg-gray-700/30 rounded-md">
                <Image
                  src={urlFor(post.image).url()}
                  alt={post.image.alt || "Post image"}
                  fill
                  className="object-contain rounded-md p-2 transition-opacity hover:opacity-95"
                />
              </div>
            )}

            <button className="flex items-center px-1 py-2 gap-1 text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span>{comments?.length || 0} Comments</span>
            </button>

            <CommentInput postId={post._id} />
            <CommentList postId={post._id} comments={comments || []} userId={userId} />
          </div>
        </div>

        {/* Buttons */}
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-2">
            <ReportButton contentId={post._id} />

            {post.author?._id && (
              <DeleteButton
                contentOwnerId={post.author?._id}
                contentId={post._id}
                contentType="post"
              />
            )}
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error("Error rendering post:", error);
    return (
      <div className="p-4 bg-card rounded-md border border-border">
        <p className="text-muted-foreground">Failed to load post</p>
      </div>
    );
  }
}

export default Post;
