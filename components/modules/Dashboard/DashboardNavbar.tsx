import { getDefaultDashboardRoute } from "@/lib/authUtils";

import { getUserInfo } from "@/service/auth.service";
import { getNavItemsByRole } from "@/lib/navItems";
import { NavSection } from "@/types/dashboard.types";
import DashboardNavbarContent from "./DashboardNavberContent";

const DashboardNavbar = async () => {
  const userInfo = await getUserInfo();
  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);

  const dashboardHome = getDefaultDashboardRoute(userInfo.role);
  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardNavbar;
