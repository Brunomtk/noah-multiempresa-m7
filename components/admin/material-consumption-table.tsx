"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function MaterialConsumptionTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [data] = useState(() => [
    {
      id: "MAT-001",
      name: "All-Purpose Cleaner",
      category: "Cleaning Solutions",
      company: "CleanCo Services",
      quantity: 345,
      unit: "bottles",
      cost: "$1,725.00",
      trend: "Increasing",
    },
    {
      id: "MAT-002",
      name: "Microfiber Cloths",
      category: "Tools & Equipment",
      company: "Sparkle Cleaning",
      quantity: 520,
      unit: "pieces",
      cost: "$780.00",
      trend: "Stable",
    },
    {
      id: "MAT-003",
      name: "Disinfectant Spray",
      category: "Cleaning Solutions",
      company: "Fresh & Clean",
      quantity: 280,
      unit: "bottles",
      cost: "$1,400.00",
      trend: "Increasing",
    },
    {
      id: "MAT-004",
      name: "Rubber Gloves",
      category: "Safety Gear",
      company: "Elite Cleaners",
      quantity: 450,
      unit: "pairs",
      cost: "$675.00",
      trend: "Decreasing",
    },
    {
      id: "MAT-005",
      name: "Floor Cleaner",
      category: "Cleaning Solutions",
      company: "CleanCo Services",
      quantity: 210,
      unit: "bottles",
      cost: "$1,050.00",
      trend: "Stable",
    },
    {
      id: "MAT-006",
      name: "Vacuum Bags",
      category: "Disposables",
      company: "Sparkle Cleaning",
      quantity: 180,
      unit: "pieces",
      cost: "$540.00",
      trend: "Increasing",
    },
    {
      id: "MAT-007",
      name: "Glass Cleaner",
      category: "Cleaning Solutions",
      company: "Fresh & Clean",
      quantity: 195,
      unit: "bottles",
      cost: "$975.00",
      trend: "Stable",
    },
    {
      id: "MAT-008",
      name: "Mop Heads",
      category: "Tools & Equipment",
      company: "Elite Cleaners",
      quantity: 120,
      unit: "pieces",
      cost: "$600.00",
      trend: "Decreasing",
    },
    {
      id: "MAT-009",
      name: "Face Masks",
      category: "Safety Gear",
      company: "CleanCo Services",
      quantity: 350,
      unit: "pieces",
      cost: "$175.00",
      trend: "Decreasing",
    },
    {
      id: "MAT-010",
      name: "Toilet Cleaner",
      category: "Cleaning Solutions",
      company: "Sparkle Cleaning",
      quantity: 230,
      unit: "bottles",
      cost: "$920.00",
      trend: "Increasing",
    },
  ])

  const columns: ColumnDef<(typeof data)[0]>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Material Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string
        return <Badge variant="outline">{category}</Badge>
      },
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const quantity = row.getValue("quantity") as number
        const unit = row.original.unit
        return (
          <div className="text-right font-medium">
            {quantity} {unit}
          </div>
        )
      },
    },
    {
      accessorKey: "cost",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Total Cost
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "trend",
      header: "Usage Trend",
      cell: ({ row }) => {
        const trend = row.getValue("trend") as string
        return (
          <Badge variant={trend === "Increasing" ? "default" : trend === "Stable" ? "secondary" : "destructive"}>
            {trend}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>View usage history</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Export data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search materials..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "id" ? "ID" : column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{" "}
          <span className="font-medium">{data.length}</span> materials.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
