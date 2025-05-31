import { getPosts } from "@/sanity/lib/post/getPosts";
import { currentUser } from "@clerk/nextjs/server";
import Post from "./Post";
import { GetAllPostsQueryResult } from "@/sanity.types";

interface PostsListProps {
  sort?: string;
}

async function PostsList({ sort = 'new' }: PostsListProps) {
  try {
    const posts = await getPosts(sort);
    const user = await currentUser();

    return (
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post: GetAllPostsQueryResult[number]) => (
            <Post key={post._id} post={post} userId={user?.id || null} />
          ))
        ) : (
          <div className="p-6 text-center bg-card rounded-lg border border-border">
            <h3 className="text-lg font-medium">No posts found</h3>
            <p className="text-muted-foreground mt-2">
              Be the first to create a post in this community!
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <div className="p-6 text-center bg-card rounded-lg border border-border">
        <h3 className="text-lg font-medium text-destructive">Error loading posts</h3>
        <p className="text-muted-foreground mt-2">
          There was an error loading posts. Please try again later.
        </p>
      </div>
    );
  }
}

export default PostsList;
