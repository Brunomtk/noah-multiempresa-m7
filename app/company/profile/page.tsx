import { Suspense } from "react"
import type { Metadata } from "next"
import { CompanyProfileForm } from "@/components/company/company-profile-form"
import { CompanyProfileSecurity } from "@/components/company/company-profile-security"
import { CompanyProfileNotifications } from "@/components/company/company-profile-notifications"
import { CompanyProfileHours } from "@/components/company/company-profile-hours"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Perfil da Empresa | Noah",
  description: "Gerencie as informações do perfil da sua empresa",
}

export default function CompanyProfilePage() {
  return (
    <main className="container max-w-7xl mx-auto">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="hours">Horário de Funcionamento</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>Atualize as informações básicas da sua empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Carregando...</div>}>
                <CompanyProfileForm />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie as configurações de segurança da sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Carregando...</div>}>
                <CompanyProfileSecurity />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>Configure como você deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Carregando...</div>}>
                <CompanyProfileNotifications />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
              <CardDescription>Configure os horários de funcionamento da sua empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Carregando...</div>}>
                <CompanyProfileHours />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
