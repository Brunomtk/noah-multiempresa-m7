import { Package, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MaterialModal } from "@/components/admin/material-modal"
import { MaterialDetailsModal } from "@/components/admin/material-details-modal"

export default function MaterialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Materials Management</h1>
        <MaterialModal>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Material
          </Button>
        </MaterialModal>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <TabsList className="mb-0">
            <TabsTrigger value="all">All Materials</TabsTrigger>
            <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search materials..."
                className="w-full pl-8 bg-[#1a2234] border-[#2a3349]"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] bg-[#1a2234] border-[#2a3349]">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="company1">CleanCo</SelectItem>
                <SelectItem value="company2">MaidPro</SelectItem>
                <SelectItem value="company3">ServiceMaster</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cleaning" className="m-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials
              .filter((material) => material.category === "Cleaning")
              .map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="m-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials
              .filter((material) => material.category === "Tools")
              .map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="safety" className="m-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials
              .filter((material) => material.category === "Safety")
              .map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MaterialCard({ material }) {
  return (
    <div className="bg-[#1a2234] border border-[#2a3349] rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-[#2a3349] flex items-center justify-center">
              <Package className="h-5 w-5 text-[#06b6d4]" />
            </div>
            <div>
              <h3 className="font-medium text-white">{material.name}</h3>
              <p className="text-sm text-gray-400">{material.category}</p>
            </div>
          </div>
          <MaterialDetailsModal material={material}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">View details</span>
              <span className="text-xs font-medium text-[#06b6d4]">Details</span>
            </Button>
          </MaterialDetailsModal>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Stock:</span>
            <span className="text-white">
              {material.stock} {material.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Price:</span>
            <span className="text-white">${material.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Company:</span>
            <span className="text-white">{material.company}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#2a3349]">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Last Updated:</span>
            <span className="text-xs text-gray-400">{material.lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const materials = [
  {
    id: 1,
    name: "All-Purpose Cleaner",
    category: "Cleaning",
    stock: 120,
    unit: "bottles",
    price: 4.99,
    company: "CleanCo",
    description: "Effective for most surfaces including countertops, appliances, and walls.",
    lastUpdated: "2023-05-15",
    image: "/placeholder.svg?height=100&width=100&query=cleaning%20product",
  },
  {
    id: 2,
    name: "Microfiber Cloths",
    category: "Cleaning",
    stock: 350,
    unit: "pcs",
    price: 1.99,
    company: "MaidPro",
    description: "High-quality microfiber cloths for streak-free cleaning of glass and surfaces.",
    lastUpdated: "2023-05-12",
    image: "/placeholder.svg?height=100&width=100&query=microfiber%20cloth",
  },
  {
    id: 3,
    name: "Floor Mop",
    category: "Tools",
    stock: 45,
    unit: "pcs",
    price: 24.99,
    company: "ServiceMaster",
    description: "Professional-grade floor mop with adjustable handle and washable head.",
    lastUpdated: "2023-05-10",
    image: "/placeholder.svg?height=100&width=100&query=floor%20mop",
  },
  {
    id: 4,
    name: "Glass Cleaner",
    category: "Cleaning",
    stock: 85,
    unit: "bottles",
    price: 3.99,
    company: "CleanCo",
    description: "Ammonia-free formula for streak-free cleaning of windows and mirrors.",
    lastUpdated: "2023-05-14",
    image: "/placeholder.svg?height=100&width=100&query=glass%20cleaner",
  },
  {
    id: 5,
    name: "Rubber Gloves",
    category: "Safety",
    stock: 200,
    unit: "pairs",
    price: 2.49,
    company: "MaidPro",
    description: "Durable rubber gloves to protect hands from chemicals and hot water.",
    lastUpdated: "2023-05-11",
    image: "/placeholder.svg?height=100&width=100&query=rubber%20gloves",
  },
  {
    id: 6,
    name: "Vacuum Cleaner",
    category: "Tools",
    stock: 15,
    unit: "pcs",
    price: 149.99,
    company: "ServiceMaster",
    description: "Commercial-grade vacuum cleaner with HEPA filtration system.",
    lastUpdated: "2023-05-08",
    image: "/placeholder.svg?height=100&width=100&query=vacuum%20cleaner",
  },
  {
    id: 7,
    name: "Disinfectant Spray",
    category: "Cleaning",
    stock: 110,
    unit: "bottles",
    price: 5.99,
    company: "CleanCo",
    description: "Kills 99.9% of germs and viruses on hard surfaces.",
    lastUpdated: "2023-05-13",
    image: "/placeholder.svg?height=100&width=100&query=disinfectant%20spray",
  },
  {
    id: 8,
    name: "Safety Goggles",
    category: "Safety",
    stock: 75,
    unit: "pcs",
    price: 8.99,
    company: "MaidPro",
    description: "Clear safety goggles to protect eyes when using chemical cleaners.",
    lastUpdated: "2023-05-09",
    image: "/placeholder.svg?height=100&width=100&query=safety%20goggles",
  },
  {
    id: 9,
    name: "Carpet Cleaner",
    category: "Tools",
    stock: 12,
    unit: "pcs",
    price: 299.99,
    company: "ServiceMaster",
    description: "Professional carpet cleaning machine with hot water extraction.",
    lastUpdated: "2023-05-07",
    image: "/placeholder.svg?height=100&width=100&query=carpet%20cleaner",
  },
]
