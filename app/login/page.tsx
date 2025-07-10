import { LoginForm } from "@/components/login-form"
import { NoahLogo } from "@/components/noah-logo"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <NoahLogo className="h-12 w-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Cleaning Platform</h1>
          <p className="text-gray-400 text-center">Enter your credentials to access the system</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
