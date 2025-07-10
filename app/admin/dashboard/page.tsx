import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Calendar, CheckCircle, Clock, Star, Users, XCircle } from "lucide-react"
import { DashboardChart } from "@/components/admin/dashboard-chart"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentActivities } from "@/components/admin/recent-activities"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400">Bem-vindo ao painel administrativo da Noah.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStats title="Agendamentos da Semana" value="128" change="+12%" icon={Calendar} trend="up" />
        <DashboardStats title="Empresas Ativas" value="24" change="+2" icon={Users} trend="up" />
        <DashboardStats title="Profissionais em Serviço" value="45" change="-3" icon={Clock} trend="down" />
        <DashboardStats title="Avaliações Positivas" value="92%" change="+5%" icon={Star} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1a2234] border-[#2a3349] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Agendamentos por Dia</CardTitle>
            <CardDescription className="text-gray-400">Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Status de Pagamentos</CardTitle>
            <CardDescription className="text-gray-400">Mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Pagos</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">R$ 24.500,00</span>
                  <span className="text-xs text-green-500">68%</span>
                </div>
              </div>

              <div className="w-full bg-[#0f172a] rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "68%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm">Pendentes</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">R$ 11.500,00</span>
                  <span className="text-xs text-red-500">32%</span>
                </div>
              </div>

              <div className="w-full bg-[#0f172a] rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "32%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-[#1a2234] border-[#2a3349] text-white lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Atividades Recentes</CardTitle>
            <CardDescription className="text-gray-400">Últimas 24 horas</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivities />
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Atalhos Rápidos</CardTitle>
            <CardDescription className="text-gray-400">Acesso rápido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-[#0f172a] border-[#2a3349] hover:border-[#06b6d4] transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Calendar className="h-6 w-6 text-[#06b6d4] mb-2" />
                  <span className="text-xs">Novo Agendamento</span>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349] hover:border-[#06b6d4] transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Users className="h-6 w-6 text-[#06b6d4] mb-2" />
                  <span className="text-xs">Nova Empresa</span>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349] hover:border-[#06b6d4] transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Users className="h-6 w-6 text-[#06b6d4] mb-2" />
                  <span className="text-xs">Novo Profissional</span>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349] hover:border-[#06b6d4] transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <BarChart className="h-6 w-6 text-[#06b6d4] mb-2" />
                  <span className="text-xs">Exportar Relatório</span>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
