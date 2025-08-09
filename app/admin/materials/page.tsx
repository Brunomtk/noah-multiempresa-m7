"use client"
import { CompanyMaterialsProvider } from "@/contexts/company-materials-context"
import { MaterialsContent } from "@/components/admin/materials-content"

export default function MaterialsPage() {
  return (
    <CompanyMaterialsProvider>
      <MaterialsContent />
    </CompanyMaterialsProvider>
  )
}
