'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types";
import { ArrowUpDown, Star } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

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
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
        const product = row.original;
        return (
            <div className="flex items-center gap-3">
                <Image 
                    src={product.imageUrl}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-md"
                    data-ai-hint="product image"
                />
                <span className="font-medium">{product.name}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);

        return <div className="text-right font-mono pr-4">{formatted}</div>
    }
  },
  {
    accessorKey: "rating",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => {
        const rating = parseFloat(row.getValue("rating"));
        return (
            <div className="flex items-center gap-1">
                <span>{rating.toFixed(1)}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </div>
        )
    }
  },
];
