import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface CRUDTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
  }[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

export function CRUDTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
}: CRUDTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.key)}>{column.header}</TableHead>
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {columns.map((column) => (
              <TableCell key={String(column.key)}>
                {String(item[column.key])}
              </TableCell>
            ))}
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="mr-2"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
