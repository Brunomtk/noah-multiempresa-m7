import type { Metadata } from "next"
import { CompanyPaymentsProvider } from "@/contexts/company-payments-context"
import { CompanyPaymentsContent } from "@/components/company/company-payments-content"

export const metadata: Metadata = {
  title: "Payments | Noah Company",
  description: "Manage your company payments",
}

export default function CompanyPaymentsPage() {
  // In a real app, this would come from auth context or session
  const companyId = 1 // This should be dynamic based on the logged-in company

  return (
    <CompanyPaymentsProvider companyId={companyId}>
      <CompanyPaymentsContent />
    </CompanyPaymentsProvider>
  )
}
