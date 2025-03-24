import React from 'react';
import { Skeleton } from "../ui/skeleton";

export function UserManagementSqueleton() {
  const skeletonRows = Array.from({ length: 7 }).map((_, index) => (
    <tr key={index}>
      <td>
        <Skeleton className="h-4 w-8" />
      </td>
      <td>
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="text-right">
        <Skeleton className="h-4 w-16" />
      </td>
    </tr>
  ));

  return (
    <div className="rounded-lg border shadow-sm">
      <div className="relative w-full overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr>
              <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">ID</th>
              <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">Pseudo</th>
              <th className="text-foreground h-10 px-2 text-right align-middle font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {skeletonRows}
          </tbody>
        </table>
      </div>
    </div>
  );
}