"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Calendar, CreditCard, BarChart3, Shield, Clock, Star } from "lucide-react"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Navigation */}
      <nav
        className={`border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Maids%20Flow%20%281%29-iwGGBAvJFCYKXI4CVTafdWy2BFNpLk.png"
                  alt="Maids Flow Logo"
                  className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                Maids Flow
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="#features"
                className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#pricing"
                className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 relative group"
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#about"
                className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div
            className={`mb-8 transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="relative inline-block mb-6 group">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Maids%20Flow%20%281%29-iwGGBAvJFCYKXI4CVTafdWy2BFNpLk.png"
                alt="Maids Flow Logo"
                className="h-24 w-24 mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            </div>
            <h1
              className={`text-5xl md:text-6xl font-bold text-white mb-6 transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              Streamline Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse">
                Cleaning Business
              </span>
            </h1>
            <p
              className={`text-xl text-slate-300 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              The complete management platform for cleaning service companies. Manage appointments, track professionals,
              handle payments, and grow your business with ease.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 group"
                >
                  <span className="group-hover:animate-pulse">Get Started Today</span>
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 bg-transparent transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:text-blue-400 hover:shadow-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
              Everything You Need to Manage Your Business
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              From scheduling to payments, Maids Flow provides all the tools you need to run a successful cleaning
              service business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Smart Scheduling",
                desc: "Manage appointments, recurring services, and professional schedules with our intuitive calendar system.",
                color: "text-blue-400",
                delay: "delay-100",
              },
              {
                icon: Users,
                title: "Team Management",
                desc: "Track your cleaning professionals, manage teams, and monitor performance with detailed analytics.",
                color: "text-green-400",
                delay: "delay-200",
              },
              {
                icon: CreditCard,
                title: "Payment Processing",
                desc: "Handle invoicing, track payments, and manage billing with integrated payment processing.",
                color: "text-purple-400",
                delay: "delay-300",
              },
              {
                icon: BarChart3,
                title: "Business Analytics",
                desc: "Get insights into your business performance with comprehensive reports and analytics.",
                color: "text-orange-400",
                delay: "delay-400",
              },
              {
                icon: Clock,
                title: "Time Tracking",
                desc: "Track check-ins, check-outs, and service duration for accurate billing and performance monitoring.",
                color: "text-red-400",
                delay: "delay-500",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                desc: "Enterprise-grade security with reliable cloud infrastructure to keep your data safe.",
                color: "text-cyan-400",
                delay: "delay-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`bg-slate-900/50 border-slate-700 transition-all duration-500 hover:scale-105 hover:bg-slate-900/70 hover:border-slate-600 hover:shadow-xl group ${feature.delay}`}
              >
                <CardHeader>
                  <feature.icon
                    className={`h-10 w-10 ${feature.color} mb-2 transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse`}
                  />
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Flexible pricing plans designed to grow with your cleaning business. Start small and scale as you expand.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="bg-slate-900/50 border-slate-700 relative transition-all duration-500 hover:scale-105 hover:shadow-xl group">
              <CardHeader>
                <CardTitle className="text-white text-2xl group-hover:text-blue-400 transition-colors duration-300">
                  Starter
                </CardTitle>
                <CardDescription className="text-slate-300">Perfect for small cleaning businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                    $199
                  </span>
                  <span className="text-slate-300">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Up to 5 professionals",
                    "100 appointments/month",
                    "Basic scheduling",
                    "Payment tracking",
                    "Email support",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-slate-300 group-hover:text-slate-200 transition-colors duration-300"
                    >
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 group-hover:animate-pulse" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="block mt-6">
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white transition-all duration-300 hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="bg-slate-900/50 border-blue-500 relative transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/25 group">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-pulse">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-white text-2xl group-hover:text-blue-400 transition-colors duration-300">
                  Professional
                </CardTitle>
                <CardDescription className="text-slate-300">Ideal for growing cleaning companies</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                    $399
                  </span>
                  <span className="text-slate-300">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Up to 25 professionals",
                    "Unlimited appointments",
                    "Advanced scheduling",
                    "Payment processing",
                    "Analytics & reports",
                    "Priority support",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-slate-300 group-hover:text-slate-200 transition-colors duration-300"
                    >
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 group-hover:animate-pulse" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="block mt-6">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-slate-900/50 border-slate-700 relative transition-all duration-500 hover:scale-105 hover:shadow-xl group">
              <CardHeader>
                <CardTitle className="text-white text-2xl group-hover:text-purple-400 transition-colors duration-300">
                  Enterprise
                </CardTitle>
                <CardDescription className="text-slate-300">For large cleaning service operations</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                    $799
                  </span>
                  <span className="text-slate-300">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Unlimited professionals",
                    "Unlimited appointments",
                    "Multi-location support",
                    "Advanced integrations",
                    "Custom reporting",
                    "24/7 dedicated support",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-slate-300 group-hover:text-slate-200 transition-colors duration-300"
                    >
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 group-hover:animate-pulse" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="block mt-6">
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white transition-all duration-300 hover:scale-105">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-500/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="transition-all duration-1000 hover:translate-x-2">
              <h2 className="text-4xl font-bold text-white mb-6">Why Choose Maids Flow?</h2>
              <p className="text-lg text-slate-300 mb-6">
                Built specifically for cleaning service businesses, Maids Flow understands the unique challenges you
                face. Our platform combines powerful features with an intuitive interface to help you manage your
                operations efficiently.
              </p>
              <div className="space-y-4">
                {["Trusted by 500+ cleaning companies", "99.9% uptime guarantee", "24/7 customer support"].map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-center group transition-all duration-300 hover:translate-x-2"
                    >
                      <Star className="h-6 w-6 text-yellow-400 mr-3 group-hover:animate-spin transition-all duration-300" />
                      <span className="text-slate-300 group-hover:text-white transition-colors duration-300">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="relative group">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Maids%20Flow%20%281%29-iwGGBAvJFCYKXI4CVTafdWy2BFNpLk.png"
                  alt="Maids Flow Platform"
                  className="h-64 w-64 mx-auto opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-3"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6 animate-pulse">
            Ready to Transform Your Cleaning Business?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join hundreds of cleaning companies already using Maids Flow to streamline their operations and grow their
            business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/25 group"
              >
                <span className="group-hover:animate-pulse">Start Your Free Trial</span>
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 bg-transparent transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:text-blue-400 hover:shadow-lg"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0 group">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Maids%20Flow%20%281%29-iwGGBAvJFCYKXI4CVTafdWy2BFNpLk.png"
                alt="Maids Flow Logo"
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                Maids Flow
              </span>
            </div>
            <div className="flex space-x-6">
              {["Privacy Policy", "Terms of Service", "Contact"].map((link, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-105 relative group"
                >
                  {link}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400">© 2025 Maids Flow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
