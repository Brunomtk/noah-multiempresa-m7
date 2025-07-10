"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface MaterialReportFiltersProps {
  onApply: () => void
}

export function MaterialReportFilters({ onApply }: MaterialReportFiltersProps) {
  const [filters, setFilters] = useState({
    minQuantity: "",
    maxQuantity: "",
    categories: [] as string[],
    companies: [] as string[],
    sortBy: "usage",
  })

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]

      return { ...prev, categories: newCategories }
    })
  }

  const handleCompanyChange = (company: string) => {
    setFilters((prev) => {
      const newCompanies = prev.companies.includes(company)
        ? prev.companies.filter((c) => c !== company)
        : [...prev.companies, company]

      return { ...prev, companies: newCompanies }
    })
  }

  const handleApply = () => {
    // Here you would typically apply the filters to your data
    console.log("Applied filters:", filters)
    onApply()
  }

  const handleReset = () => {
    setFilters({
      minQuantity: "",
      maxQuantity: "",
      categories: [],
      companies: [],
      sortBy: "usage",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h3 className="font-medium">Quantity</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="min-quantity">Minimum</Label>
              <Input
                id="min-quantity"
                placeholder="0"
                value={filters.minQuantity}
                onChange={(e) => setFilters({ ...filters, minQuantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-quantity">Maximum</Label>
              <Input
                id="max-quantity"
                placeholder="1000"
                value={filters.maxQuantity}
                onChange={(e) => setFilters({ ...filters, maxQuantity: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Material Categories</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-cleaning"
                checked={filters.categories.includes("cleaning")}
                onCheckedChange={() => handleCategoryChange("cleaning")}
              />
              <Label htmlFor="category-cleaning">Cleaning Solutions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-tools"
                checked={filters.categories.includes("tools")}
                onCheckedChange={() => handleCategoryChange("tools")}
              />
              <Label htmlFor="category-tools">Tools & Equipment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-safety"
                checked={filters.categories.includes("safety")}
                onCheckedChange={() => handleCategoryChange("safety")}
              />
              <Label htmlFor="category-safety">Safety Gear</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-disposables"
                checked={filters.categories.includes("disposables")}
                onCheckedChange={() => handleCategoryChange("disposables")}
              />
              <Label htmlFor="category-disposables">Disposables</Label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Companies</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="company-cleanco"
                checked={filters.companies.includes("cleanco")}
                onCheckedChange={() => handleCompanyChange("cleanco")}
              />
              <Label htmlFor="company-cleanco">CleanCo Services</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="company-sparkle"
                checked={filters.companies.includes("sparkle")}
                onCheckedChange={() => handleCompanyChange("sparkle")}
              />
              <Label htmlFor="company-sparkle">Sparkle Cleaning</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="company-fresh"
                checked={filters.companies.includes("fresh")}
                onCheckedChange={() => handleCompanyChange("fresh")}
              />
              <Label htmlFor="company-fresh">Fresh & Clean</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="company-elite"
                checked={filters.companies.includes("elite")}
                onCheckedChange={() => handleCompanyChange("elite")}
              />
              <Label htmlFor="company-elite">Elite Cleaners</Label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Sort By</h3>
          <RadioGroup value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="usage" id="sort-usage" />
              <Label htmlFor="sort-usage">Usage (Highest First)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="usage-asc" id="sort-usage-asc" />
              <Label htmlFor="sort-usage-asc">Usage (Lowest First)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cost" id="sort-cost" />
              <Label htmlFor="sort-cost">Cost (Highest First)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cost-asc" id="sort-cost-asc" />
              <Label htmlFor="sort-cost-asc">Cost (Lowest First)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="name" id="sort-name" />
              <Label htmlFor="sort-name">Name (A-Z)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Time Period</h3>
          <Select defaultValue="last-30">
            <SelectTrigger>
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7">Last 7 days</SelectItem>
              <SelectItem value="last-30">Last 30 days</SelectItem>
              <SelectItem value="last-90">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          Reset Filters
        </Button>
        <Button onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  )
}
