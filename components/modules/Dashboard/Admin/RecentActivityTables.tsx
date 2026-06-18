import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DateCell from "@/components/shared/Cell/DataCell";
import { formatCurrency, truncateText } from "@/lib/formatters";
import { RecentPurchase, RecentUser } from "@/types/dashboard.types";
import { ShoppingBag, Users } from "lucide-react";

interface RecentUsersTableProps {
  users: RecentUser[];
}

export const RecentUsersTable = ({ users }: RecentUsersTableProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>Latest registered members and admins</CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No users yet</EmptyTitle>
              <EmptyDescription>
                New user registrations will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="max-w-[140px] font-medium">
                      <div className="truncate">{user.name}</div>
                      <div className="truncate text-xs text-muted-foreground sm:hidden">
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden max-w-[180px] truncate sm:table-cell">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "ADMIN" ? "default" : "secondary"}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={
                          user.status === "ACTIVE" ? "outline" : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DateCell date={user.createdAt} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface RecentPurchasesTableProps {
  purchases: RecentPurchase[];
}

export const RecentPurchasesTable = ({
  purchases,
}: RecentPurchasesTableProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Purchases</CardTitle>
        <CardDescription>Latest completed idea purchases</CardDescription>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBag />
              </EmptyMedia>
              <EmptyTitle>No purchases yet</EmptyTitle>
              <EmptyDescription>
                Completed purchases will show up here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Idea</TableHead>
                  <TableHead className="hidden md:table-cell">Buyer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="max-w-[180px]">
                      <div className="truncate font-medium">
                        {truncateText(purchase.idea.title, 35)}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 md:hidden">
                        <span className="truncate text-xs text-muted-foreground">
                          {purchase.user.name}
                        </span>
                        {purchase.idea.isPaid && (
                          <Badge variant="secondary" className="text-[10px]">
                            Paid
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden max-w-[160px] md:table-cell">
                      <div className="truncate">{purchase.user.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {purchase.user.email}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(purchase.amountPaid)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DateCell
                        date={purchase.completedAt}
                        formatString="MMM dd, yyyy HH:mm"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
