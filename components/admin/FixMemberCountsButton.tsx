"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface ResultItem {
  id: string;
  title: string;
  previousCount: number;
  newCount: number;
}

interface FixMemberCountsResult {
  success: boolean;
  message: string;
  updatedCount: number;
  results?: ResultItem[];
  error?: string;
}

interface FixMemberCountsButtonProps {
  communityId?: string;
  onSuccess?: (data: FixMemberCountsResult) => void;
}

export function FixMemberCountsButton({ 
  communityId, 
  onSuccess 
}: FixMemberCountsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFixMemberCounts = async () => {
    setIsLoading(true);
    try {
      // Call the API endpoint to fix member counts
      const url = communityId 
        ? `/api/admin/fix-member-counts?communityId=${communityId}`
        : '/api/admin/fix-member-counts';
      
      const response = await fetch(url);
      const data = await response.json() as FixMemberCountsResult;

      if (data.success) {
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess(data);
        }
        
        toast({
          title: "Success",
          description: data.message || "Member counts fixed successfully",
        });
      } else {
        throw new Error(data.error || "Failed to fix member counts");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleFixMemberCounts} 
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Fixing...
        </>
      ) : (
        <>Fix Member Count{communityId ? '' : 's'}</>
      )}
    </Button>
  );
} 