import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function PaeeTableSkeleton({ pageSize = 15 }: { pageSize?: number }) {
  return (
    <>
      {Array.from({ length: pageSize }).map((_, idx) => (
        <TableRow key={idx}>
          <TableCell><Skeleton className="h-5 w-32 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-32 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-32 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24 animate-pulse bg-gray-200" /></TableCell>
          <TableCell>
            <div className="flex justify-center gap-1">
              <Skeleton className="h-8 w-8 rounded-full animate-pulse bg-gray-200" />
              <Skeleton className="h-8 w-8 rounded-full animate-pulse bg-gray-200" />
              <Skeleton className="h-8 w-8 rounded-full animate-pulse bg-gray-200" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
