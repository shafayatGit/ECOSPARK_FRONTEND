import { formatCurrency, formatNumber } from "@/lib/formatters";
import { DashboardOverview } from "@/types/dashboard.types";
import {
  DollarSign,
  FolderTree,
  Lightbulb,
  Mail,
  MessageSquare,
  ThumbsUp,
  Users,
} from "lucide-react";
import StatCard from "./StatCard";

interface DashboardOverviewCardsProps {
  overview: DashboardOverview;
}

const DashboardOverviewCards = ({ overview }: DashboardOverviewCardsProps) => {
  const { users, ideas, engagement, categories, newsletter, purchases } =
    overview;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Users"
        value={formatNumber(users.total)}
        description={`${users.members} members · ${users.admins} admins`}
        icon={Users}
        trend={{
          value: `${users.active} active`,
          label: "· verified",
        }}
      />
      <StatCard
        title="Total Ideas"
        value={formatNumber(ideas.total)}
        description={`${ideas.approved} approved · ${ideas.draft} drafts`}
        icon={Lightbulb}
        iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        trend={{
          value: `${ideas.paid} paid`,
          label: `· ${ideas.free} free`,
        }}
      />
      <StatCard
        title="Total Revenue"
        value={formatCurrency(purchases.totalRevenue)}
        description={`${purchases.completed} completed purchases`}
        icon={DollarSign}
        iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        trend={{
          value: `${purchases.pending} pending`,
          label: `· ${purchases.failed} failed`,
        }}
      />
      <StatCard
        title="Engagement"
        value={formatNumber(engagement.votes + engagement.comments)}
        description={`${engagement.votes} votes · ${engagement.comments} comments`}
        icon={ThumbsUp}
        iconClassName="bg-sky-500/10 text-sky-600 dark:text-sky-400"
      />
      <StatCard
        title="Categories"
        value={formatNumber(categories.total)}
        description="Active idea categories"
        icon={FolderTree}
        iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
      />
      <StatCard
        title="Newsletter"
        value={formatNumber(newsletter.total)}
        description={`${newsletter.active} active subscribers`}
        icon={Mail}
        iconClassName="bg-rose-500/10 text-rose-600 dark:text-rose-400"
      />
      <StatCard
        title="Purchases"
        value={formatNumber(purchases.total)}
        description="All-time transactions"
        icon={DollarSign}
      />
      <StatCard
        title="Comments"
        value={formatNumber(engagement.activeComments)}
        description="Active community comments"
        icon={MessageSquare}
      />
    </div>
  );
};

export default DashboardOverviewCards;
