import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  emptyState: React.ReactNode;
}

export function DataTable<T>({
  headers,
  data,
  renderRow,
  emptyState,
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 dark:border-slate-800">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="font-semibold uppercase text-sm tracking-wider text-slate-500 dark:text-slate-300"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item))
          ) : (
            <TableRow>{emptyState}</TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
