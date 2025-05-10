import React from "react";
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    fullName?: string;
    email?: string;
    profile?: {
      profileImage?: string;
    };
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ user, className = "", size = "md" }: UserAvatarProps) {
  // Size classes based on the size prop
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  // Get initials from user data
  const getInitials = (): string => {
    // Try to get initials from full name first
    if (user.fullName && user.fullName.trim() !== "") {
      // Take first character of each word in the name
      const nameParts = user.fullName.split(" ");
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return user.fullName[0].toUpperCase();
    }
    
    // If no full name, use email
    if (user.email && user.email.trim() !== "") {
      return user.email[0].toUpperCase();
    }
    
    // If no email either, return empty (will use icon)
    return "";
  };

  // Image URL - adjust based on your API and storage setup
  const imageUrl = user.profile?.profileImage 
    ? `/api/uploads/profiles/${user.profile.profileImage}` // Using relative URL with proxy
    : "";

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {imageUrl ? <AvatarImage src={imageUrl} alt="Profile" /> : null}
      <AvatarFallback className="bg-primary text-white font-semibold">
        {getInitials() || <User className="h-1/2 w-1/2" />}
      </AvatarFallback>
    </Avatar>
  );
}
