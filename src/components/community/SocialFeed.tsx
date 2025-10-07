"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Post {
  id: number;
  authorId: number;
  content: string;
  mediaUrls: string[] | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  authorName?: string;
  isLiked?: boolean;
}

interface Comment {
  id: number;
  postId: number;
  authorId: number;
  content: string;
  createdAt: string;
  authorName?: string;
}

export function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/social-posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPostContent.trim()) {
      toast.error("Please enter some content");
      return;
    }

    setIsPosting(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/social-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newPostContent,
          mediaUrls: null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");
      
      toast.success("Post created successfully!");
      setNewPostContent("");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/social-posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to toggle like");
      
      // Update local state
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
                isLiked: !post.isLiked,
              }
            : post
        )
      );
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const loadComments = async (postId: number) => {
    try {
      const response = await fetch(`/api/social-comments?postId=${postId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      
      const data = await response.json();
      setComments(prev => ({ ...prev, [postId]: data.comments || [] }));
      setExpandedComments(postId);
    } catch (error) {
      toast.error("Failed to load comments");
    }
  };

  const addComment = async (postId: number) => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/social-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error("Failed to add comment");
      
      setNewComment("");
      loadComments(postId);
      
      // Update comments count
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, commentsCount: post.commentsCount + 1 }
            : post
        )
      );
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="mb-3"
        />
        <Button onClick={createPost} disabled={isPosting}>
          {isPosting ? "Posting..." : "Post"}
        </Button>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold">{post.authorName || `User ${post.authorId}`}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            <p className="mb-4">{post.content}</p>

            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-2">
                {post.mediaUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Post media ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLike(post.id)}
                className={post.isLiked ? "text-red-500" : ""}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-current" : ""}`}
                />
                {post.likesCount}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  expandedComments === post.id
                    ? setExpandedComments(null)
                    : loadComments(post.id)
                }
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {post.commentsCount}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {expandedComments === post.id && (
              <div className="mt-4 pt-4 border-t space-y-3">
                {comments[post.id]?.map((comment) => (
                  <div key={comment.id} className="pl-4">
                    <p className="font-semibold text-sm">
                      {comment.authorName || `User ${comment.authorId}`}
                    </p>
                    <p className="text-sm mt-1">{comment.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
                
                <div className="flex gap-2 mt-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button onClick={() => addComment(post.id)}>Post</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}