'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
        const item = row.original;
        return (
            <div className="flex items-start gap-4">
                <Image 
                    src={item.imageUrl}
                    alt={item.title}
                    width={60}
                    height={60}
                    className="rounded-md object-cover aspect-square"
                    data-ai-hint="item image"
                />
                <div className="flex flex-col gap-1">
                  <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                    {item.title}
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
            </div>
        )
    },
    size: 60, // Set a larger size for this column
  },
];
