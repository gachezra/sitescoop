'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types";
import { ArrowUpDown, CalendarDays } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

export const generateColumns = (data: Product[]): ColumnDef<Product>[] => {
  const baseColumns: ColumnDef<Product>[] = [
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
                  <div className="flex flex-col gap-1.5">
                    <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline leading-tight">
                      {item.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
              </div>
          )
      },
      size: 60,
    },
  ];

  const hasDate = data.some(item => item.date && item.date.trim() !== '');

  if (hasDate) {
    baseColumns.push({
      accessorKey: "date",
      header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      cell: ({ row }) => {
          const date = row.original.date;
          if (!date) return null;
          
          return (
              <Badge variant="outline" className="font-mono whitespace-nowrap">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {date}
              </Badge>
          )
      },
      size: 20,
    });
  }

  return baseColumns;
};
