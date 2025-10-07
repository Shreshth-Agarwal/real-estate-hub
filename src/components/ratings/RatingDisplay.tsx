"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Rating {
  id: number;
  raterId: number;
  score: number;
  reviewMd: string | null;
  createdAt: string;
  raterName?: string;
}

interface RatingDisplayProps {
  targetType: "provider" | "catalog";
  targetId: number;
}

export function RatingDisplay({ targetType, targetId }: RatingDisplayProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    fetchRatings();
  }, [targetType, targetId]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `/api/ratings?targetType=${targetType}&targetId=${targetId}`
      );
      if (!response.ok) throw new Error("Failed to fetch ratings");
      
      const data = await response.json();
      setRatings(data.ratings || []);
      
      if (data.ratings && data.ratings.length > 0) {
        const avg = data.ratings.reduce((sum: number, r: Rating) => sum + r.score, 0) / data.ratings.length;
        setAverageScore(avg);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading ratings...</div>;
  }

  if (ratings.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No ratings yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          <span className="text-2xl font-bold">{averageScore.toFixed(1)}</span>
        </div>
        <span className="text-muted-foreground">
          Based on {ratings.length} {ratings.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className="space-y-4 mt-6">
        {ratings.map((rating) => (
          <div key={rating.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`w-4 h-4 ${
                      value <= rating.score
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(rating.createdAt).toLocaleDateString()}
              </span>
            </div>
            {rating.reviewMd && (
              <p className="text-sm mt-2">{rating.reviewMd}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}