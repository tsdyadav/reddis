"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface MemberCountContextType {
  getMemberCount: (communityId: string) => number;
  updateMemberCount: (communityId: string, count: number) => void;
  incrementMemberCount: (communityId: string) => void;
  decrementMemberCount: (communityId: string) => void;
}

const MemberCountContext = createContext<MemberCountContextType | undefined>(undefined);

export function MemberCountProvider({ 
  children,
  initialCounts = {} 
}: { 
  children: ReactNode;
  initialCounts?: Record<string, number>;
}) {
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>(initialCounts);

  // Get the current member count for a community - using useCallback to memoize the function
  const getMemberCount = useCallback((communityId: string): number => {
    return memberCounts[communityId] || 0;
  }, [memberCounts]);

  // Set the member count for a community - using useCallback to memoize the function
  const updateMemberCount = useCallback((communityId: string, count: number) => {
    setMemberCounts((prevCounts) => {
      // Only update if the count is different to avoid unnecessary renders
      if (prevCounts[communityId] === count) {
        return prevCounts;
      }
      return {
        ...prevCounts,
        [communityId]: count,
      };
    });
  }, []);

  // Increment the member count for a community - using useCallback to memoize the function
  const incrementMemberCount = useCallback((communityId: string) => {
    setMemberCounts((prevCounts) => ({
      ...prevCounts,
      [communityId]: (prevCounts[communityId] || 0) + 1,
    }));
  }, []);

  // Decrement the member count for a community - using useCallback to memoize the function
  const decrementMemberCount = useCallback((communityId: string) => {
    setMemberCounts((prevCounts) => ({
      ...prevCounts,
      [communityId]: Math.max(0, (prevCounts[communityId] || 0) - 1),
    }));
  }, []);

  const value = {
    getMemberCount,
    updateMemberCount,
    incrementMemberCount,
    decrementMemberCount,
  };

  return (
    <MemberCountContext.Provider value={value}>
      {children}
    </MemberCountContext.Provider>
  );
}

// Custom hook to use the member count context
export function useMemberCount() {
  const context = useContext(MemberCountContext);
  if (context === undefined) {
    throw new Error("useMemberCount must be used within a MemberCountProvider");
  }
  return context;
} 