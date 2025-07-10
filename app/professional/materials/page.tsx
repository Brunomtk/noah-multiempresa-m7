import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CheckCircle,
  AlertTriangle,
  Package,
  Clock,
  Search,
  Plus,
  Filter,
  Calendar,
  Truck,
  CheckSquare,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"

export default function ProfessionalMaterials() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Materiais</h2>
          <p className="text-muted-foreground">Solicite e gerencie seus materiais de trabalho</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nova Solicitação de Materiais</DialogTitle>
              <DialogDescription>Selecione os materiais que você precisa para seus serviços.</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Label htmlFor="search">Buscar material</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="search" placeholder="Digite o nome do material" className="pl-8" />
                  </div>
                </div>
                <div className="w-[180px]">
                  <Label htmlFor="category">Categoria</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="cleaning">Limpeza</SelectItem>
                      <SelectItem value="protection">Proteção</SelectItem>
                      <SelectItem value="tools">Ferramentas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Material</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Desinfetante Multiuso</TableCell>
                      <TableCell>Litros</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Disponível
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" defaultValue="0" className="w-20" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Detergente Concentrado</TableCell>
                      <TableCell>Litros</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Disponível
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" defaultValue="0" className="w-20" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Luvas de Proteção</TableCell>
                      <TableCell>Pares</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Baixo
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" defaultValue="0" className="w-20" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Panos de Microfibra</TableCell>
                      <TableCell>Unidades</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Disponível
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" defaultValue="0" className="w-20" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Sacos de Lixo 100L</TableCell>
                      <TableCell>Pacotes</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Indisponível
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" defaultValue="0" disabled className="w-20" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery">Local de Entrega</Label>
                <Select defaultValue="office">
                  <SelectTrigger id="delivery">
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Escritório Central</SelectItem>
                    <SelectItem value="home">Meu Endereço</SelectItem>
                    <SelectItem value="client">Endereço do Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgência</Label>
                <Select defaultValue="normal">
                  <SelectTrigger id="urgency">
                    <SelectValue placeholder="Selecione a urgência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa (7+ dias)</SelectItem>
                    <SelectItem value="normal">Normal (3-5 dias)</SelectItem>
                    <SelectItem value="high">Alta (1-2 dias)</SelectItem>
                    <SelectItem value="urgent">Urgente (24h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  placeholder="Alguma observação sobre os materiais solicitados ou instruções de entrega?"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Enviar Solicitação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md flex items-start gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Limite de solicitações</p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Você pode fazer apenas 1 solicitação por semana. Sua próxima solicitação estará disponível em 5 dias.
          </p>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Solicitações Ativas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="inventory">Meu Inventário</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Solicitação #1458</CardTitle>
              <CardDescription>Solicitado em 24/05/2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500">Em Processamento</Badge>
                    <span className="text-sm text-muted-foreground">Atualizado há 2 horas</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="items">
                    <AccordionTrigger>Itens Solicitados</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1">
                        <li className="text-sm flex justify-between">
                          <span>Desinfetante Multiuso</span>
                          <span>2 litros</span>
                        </li>
                        <li className="text-sm flex justify-between">
                          <span>Luvas de Proteção</span>
                          <span>3 pares</span>
                        </li>
                        <li className="text-sm flex justify-between">
                          <span>Panos de Microfibra</span>
                          <span>5 unidades</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="tracking">
                    <AccordionTrigger>Acompanhamento</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Solicitação Recebida</p>
                            <p className="text-xs text-muted-foreground">24/05/2025 às 09:45</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Aprovada</p>
                            <p className="text-xs text-muted-foreground">24/05/2025 às 14:30</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                            <Clock className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Em Separação</p>
                            <p className="text-xs text-muted-foreground">25/05/2025 às 10:15</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Em Transporte</p>
                            <p className="text-xs text-muted-foreground">Pendente</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Entregue</p>
                            <p className="text-xs text-muted-foreground">Pendente</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
            <CardFooter className="pt-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Entrega prevista: 27/05/2025</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar solicitação" className="pl-8 w-[250px]" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Select defaultValue="recent">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigos</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Solicitação #1423</CardTitle>
                    <CardDescription>Solicitado em 15/05/2025</CardDescription>
                  </div>
                  <Badge className="bg-green-500">Entregue</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="items">
                    <AccordionTrigger>Itens Solicitados</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1">
                        <li className="text-sm flex justify-between">
                          <span>Detergente Concentrado</span>
                          <span>1 litro</span>
                        </li>
                        <li className="text-sm flex justify-between">
                          <span>Sacos de Lixo 50L</span>
                          <span>2 pacotes</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <Truck className="h-3 w-3 mr-1" />
                  <span>Entregue em: 18/05/2025</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Solicitação #1387</CardTitle>
                    <CardDescription>Solicitado em 02/05/2025</CardDescription>
                  </div>
                  <Badge className="bg-green-500">Entregue</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="items">
                    <AccordionTrigger>Itens Solicitados</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1">
                        <li className="text-sm flex justify-between">
                          <span>Desinfetante Multiuso</span>
                          <span>2 litros</span>
                        </li>
                        <li className="text-sm flex justify-between">
                          <span>Panos de Microfibra</span>
                          <span>3 unidades</span>
                        </li>
                        <li className="text-sm flex justify-between">
                          <span>Luvas de Proteção</span>
                          <span>2 pares</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <Truck className="h-3 w-3 mr-1" />
                  <span>Entregue em: 05/05/2025</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Solicitação #1342</CardTitle>
                    <CardDescription>Solicitado em 18/04/2025</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Cancelada
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="items">
                    <AccordionTrigger>Itens Solicitados</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1">
                        <li className="text-sm flex justify-between">
                          <span>Luvas de Proteção</span>
                          <span>4 pares</span>
                        </li>
                        <li className="text-sm flex justify-between">
                          <span>Sacos de Lixo 100L</span>
                          <span>1 pacote</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="reason">
                    <AccordionTrigger>Motivo do Cancelamento</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Solicitação cancelada devido à indisponibilidade de estoque dos itens solicitados.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline" size="sm">
              Carregar Mais
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar material" className="pl-8 w-[250px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="cleaning">Limpeza</SelectItem>
                  <SelectItem value="protection">Proteção</SelectItem>
                  <SelectItem value="tools">Ferramentas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <CheckSquare className="h-4 w-4 mr-2" />
              Registrar Uso
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Uso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Desinfetante Multiuso</TableCell>
                    <TableCell>Limpeza</TableCell>
                    <TableCell>1.5 litros</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-1">
                          Adequado
                        </Badge>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>24/05/2025</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Luvas de Proteção</TableCell>
                    <TableCell>Proteção</TableCell>
                    <TableCell>2 pares</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mb-1">
                          Baixo
                        </Badge>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>23/05/2025</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Panos de Microfibra</TableCell>
                    <TableCell>Limpeza</TableCell>
                    <TableCell>4 unidades</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-1">
                          Adequado
                        </Badge>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>22/05/2025</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Detergente Concentrado</TableCell>
                    <TableCell>Limpeza</TableCell>
                    <TableCell>0.2 litros</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mb-1">
                          Crítico
                        </Badge>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-red-500 h-1.5 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>25/05/2025</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md flex items-start gap-2">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Dica de Uso</p>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Registre o uso dos materiais após cada serviço para manter seu inventário atualizado e garantir que você
                sempre tenha o necessário para seus atendimentos.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
