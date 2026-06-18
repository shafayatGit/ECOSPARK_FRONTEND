import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  return [
    {
      // title : "Dashboard",
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
        },
        {
          title: "My Profile",
          href: `/my-profile`,
          icon: "User",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Settings",
        },
      ],
    },
  ];
};

export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "Admins",
        href: "/admin/dashboard",
        icon: "Shield",
      },

      {
        title: "Members",
        href: "/admin/dashboard/member-management",
        icon: "Users",
      },
    ],
  },
  {
    title: "Ideas Management",
    items: [
      {
        title: "Idea-Management",
        href: "/admin/dashboard/idea-management",
        icon: "Calendar",
      },
      {
        title: "Catagory-Management",
        href: "/admin/dashboard/category-management",
        icon: "Clock",
      },
      {
        title: "Purchase-Management",
        href: "/admin/dashboard/purchase-management",
        icon: "CreditCard",
      },
    ],
  },
];

export const memberNavItems: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: "Home",
      },
    ],
  },
  {
    title: "Ideas",
    items: [
      {
        title: "My Ideas",
        href: "/dashboard/my-ideas",
        icon: "Lightbulb",
      },
      {
        title: "Create Idea",
        href: "/dashboard/create-idea",
        icon: "ClipboardList",
      },
    ],
  },
  {
    title: "Purchases",
    items: [
      {
        title: "My Purchase Ideas",
        href: "/dashboard/my-purchases",
        icon: "FileText",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];

    case "MEMBER":
      return [...commonNavItems, ...memberNavItems];
  }
};
