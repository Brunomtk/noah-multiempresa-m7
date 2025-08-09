"use client"

import { CompanyMaterialsProvider } from "@/contexts/company-materials-context"
import { CompanyMaterialsContent } from "@/components/company/company-materials-content"

export default function CompanyMaterialsPage() {
  return (
    <CompanyMaterialsProvider>
      <CompanyMaterialsContent />
    </CompanyMaterialsProvider>
  )
}
