import { defineField, defineType } from "sanity";
import { UsersIcon } from "lucide-react";

export const communityMembershipType = defineType({
  name: "communityMembership",
  title: "Community Membership",
  type: "document",
  icon: UsersIcon,
  description: "Tracks user membership in communities",
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "community",
      title: "Community",
      type: "reference",
      to: [{ type: "subreddit" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "joinedAt",
      title: "Joined At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Member", value: "member" },
          { title: "Moderator", value: "moderator" },
        ],
      },
      initialValue: "member",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      userName: "user.name",
      communityTitle: "community.title",
      role: "role",
    },
    prepare({ userName, communityTitle, role }) {
      return {
        title: `${userName || "User"} - ${communityTitle || "Community"}`,
        subtitle: `Role: ${role}`,
      };
    },
  },
}); 