"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCompany } from "@/hooks/use-company"
import { Loader2, Upload } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  cnpj: z.string().min(14, {
    message: "CNPJ inválido.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(10, {
    message: "Telefone inválido.",
  }),
  website: z
    .string()
    .url({
      message: "URL inválida.",
    })
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, {
    message: "Endereço deve ter pelo menos 5 caracteres.",
  }),
  city: z.string().min(2, {
    message: "Cidade deve ter pelo menos 2 caracteres.",
  }),
  state: z.string().min(2, {
    message: "Estado deve ter pelo menos 2 caracteres.",
  }),
  zipCode: z.string().min(8, {
    message: "CEP inválido.",
  }),
  description: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function CompanyProfileForm() {
  const { toast } = useToast()
  const { company, updateCompany } = useCompany()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: company?.name || "",
      cnpj: company?.cnpj || "",
      email: company?.email || "",
      phone: company?.phone || "",
      website: company?.website || "",
      address: company?.address || "",
      city: company?.city || "",
      state: company?.state || "",
      zipCode: company?.zipCode || "",
      description: company?.description || "",
    },
    mode: "onChange",
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      // Simulação de atualização
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aqui seria a chamada real para atualizar o perfil
      // await updateCompany(company.id, data);

      toast({
        title: "Perfil atualizado",
        description: "As informações do perfil foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar as informações do perfil.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Simulação de upload
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Aqui seria a chamada real para fazer upload do logo
      // const logoUrl = await uploadCompanyLogo(company.id, file);

      toast({
        title: "Logo atualizado",
        description: "O logo da empresa foi atualizado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao fazer upload",
        description: "Ocorreu um erro ao fazer upload do logo.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-8">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={company?.logoUrl || ""} alt={company?.name || "Logo da empresa"} />
            <AvatarFallback className="text-2xl">{company?.name?.charAt(0) || "N"}</AvatarFallback>
          </Avatar>

          <div className="absolute -bottom-2 -right-2">
            <div className="relative">
              <Button size="icon" variant="outline" className="rounded-full h-8 w-8" disabled={isUploading}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Logo da Empresa</h3>
          <p className="text-sm text-muted-foreground">
            Faça upload do logo da sua empresa. Recomendamos uma imagem quadrada de pelo menos 512x512px.
          </p>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da sua empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input placeholder="00.000.000/0000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.seusite.com.br" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, complemento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu estado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição da Empresa</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva sua empresa, serviços oferecidos, etc."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </form>
      </Form>
    </div>
  )
}
