"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCompanyMaterialsUtils } from "@/hooks/use-company-materials"
import type { Material, MaterialTransaction } from "@/types/material"

interface CompanyMaterialDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  material?: Material | null
}

export function CompanyMaterialDetailsModal({ open, onOpenChange, material }: CompanyMaterialDetailsModalProps) {
  const companyId = 1 // Mock company ID
  const {
    getTransactions,
    formatCurrency,
    formatDate,
    formatQuantity,
    calculateTotalValue,
    getMaterialStatusText,
    isNearExpiry,
    isExpired,
    getDaysUntilExpiry,
  } = useCompanyMaterialsUtils(companyId)

  const [transactions, setTransactions] = useState<MaterialTransaction[]>([])
  const [loading, setLoading] = useState(false)

  // Load transactions when material changes
  useEffect(() => {
    if (material && open) {
      loadTransactions()
    }
  }, [material, open])

  const loadTransactions = async () => {
    if (!material) return

    setLoading(true)
    try {
      const result = await getTransactions(material.id)
      setTransactions(result || [])
    } catch (error) {
      console.error("Error loading transactions:", error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  if (!material) return null

  const daysUntilExpiry = getDaysUntilExpiry(material.expirationDate)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{material.name}</DialogTitle>
          <DialogDescription>Complete material information and transaction history</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Name:</span>
                      <span className="text-sm font-medium">{material.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Category:</span>
                      <span className="text-sm font-medium">{material.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Unit:</span>
                      <span className="text-sm font-medium">{material.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Barcode:</span>
                      <span className="text-sm font-medium">{material.barcode || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Location:</span>
                      <span className="text-sm font-medium">{material.location || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Stock Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Stock:</span>
                      <span className="text-sm font-medium">{formatQuantity(material)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Min Stock:</span>
                      <span className="text-sm font-medium">
                        {material.minStock} {material.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Max Stock:</span>
                      <span className="text-sm font-medium">
                        {material.maxStock} {material.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge variant="outline">{getMaterialStatusText(material)}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Supplier Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Supplier:</span>
                      <span className="text-sm font-medium">{material.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Contact:</span>
                      <span className="text-sm font-medium">{material.supplierContact || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Financial Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Unit Price:</span>
                      <span className="text-sm font-medium">{formatCurrency(material.unitPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Value:</span>
                      <span className="text-sm font-medium">{formatCurrency(calculateTotalValue(material))}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Expiration Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Expiry Date:</span>
                      <span className="text-sm font-medium">{formatDate(material.expirationDate)}</span>
                    </div>
                    {daysUntilExpiry !== null && (
                      <div className="flex justify-between">
                        <span className="text-sm">Days Until Expiry:</span>
                        <span
                          className={`text-sm font-medium ${
                            isExpired(material.expirationDate)
                              ? "text-red-600"
                              : isNearExpiry(material.expirationDate)
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {daysUntilExpiry > 0
                            ? `${daysUntilExpiry} days`
                            : daysUntilExpiry === 0
                              ? "Expires today"
                              : "Expired"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {material.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-2 text-sm">{material.description}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Transaction History</h3>
              <Button variant="outline" size="sm" onClick={loadTransactions} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={transaction.type === 1 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                        >
                          {transaction.type === 1 ? "IN" : "OUT"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transaction.quantity} {material.unit}
                      </TableCell>
                      <TableCell>{formatCurrency(transaction.unitPrice)}</TableCell>
                      <TableCell>{formatCurrency(transaction.totalValue)}</TableCell>
                      <TableCell>{transaction.reason}</TableCell>
                      <TableCell>{transaction.notes || "N/A"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      {loading ? "Loading transactions..." : "No transactions found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <h3 className="text-lg font-medium">Usage Analytics</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">{material.currentStock}</div>
                <div className="text-sm text-muted-foreground">Current Stock</div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">{formatCurrency(calculateTotalValue(material))}</div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">{transactions.filter((t) => t.type === 0).length}</div>
                <div className="text-sm text-muted-foreground">Times Used</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Stock Levels</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current:</span>
                    <span>
                      {material.currentStock} {material.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Minimum:</span>
                    <span>
                      {material.minStock} {material.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Maximum:</span>
                    <span>
                      {material.maxStock} {material.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((material.currentStock / material.maxStock) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between text-sm">
                      <span>{transaction.type === 1 ? "Added" : "Used"}</span>
                      <span>
                        {transaction.quantity} {material.unit}
                      </span>
                    </div>
                  ))}
                  {transactions.length === 0 && <div className="text-sm text-muted-foreground">No recent activity</div>}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
