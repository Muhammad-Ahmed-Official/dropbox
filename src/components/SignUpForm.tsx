"use client"

import { useForm } from "react-hook-form"
import z from "zod"
import { signUpSchema } from "@/schemas/signUpSchema"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card"
import { Divider } from "@heroui/divider"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { Mail, Lock, User, CheckCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useUserContext } from "@/contextApi/UserProvider"

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { refetch } = useUserContext()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { userName: "", email: "", password: "", passwordConfirmation: "" }
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: data.userName,
          email: data.email,
          password: data.password,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.message || 'Sign up failed')
        return
      }
      await refetch()
      router.push('/dashboard')
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <Card className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <h1 className="text-2xl font-bold text-default-900">Create Your Account</h1>
        <p className="text-default-500 text-center">Sign up to start managing your files securely</p>
      </CardHeader>

      <Divider />

      <CardBody className="py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="userName" className="text-sm font-medium text-default-900">Username</label>
            <Input
              id="userName"
              type="text"
              placeholder="your_username"
              startContent={<User className="h-4 w-4 text-default-500" />}
              isInvalid={!!errors.userName}
              errorMessage={errors.userName?.message}
              {...register("userName")}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-default-900">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              startContent={<Mail className="h-4 w-4 text-default-500" />}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              {...register("email")}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-default-900">Password</label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              startContent={<Lock className="h-4 w-4 text-default-500" />}
              endContent={
                <Button isIconOnly variant="light" size="sm" onClick={() => setShowPassword(!showPassword)} type="button">
                  {showPassword ? <EyeOff className="h-4 w-4 text-default-500" /> : <Eye className="h-4 w-4 text-default-500" />}
                </Button>
              }
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register("password")}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="passwordConfirmation" className="text-sm font-medium text-default-900">Confirm Password</label>
            <Input
              id="passwordConfirmation"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              startContent={<Lock className="h-4 w-4 text-default-500" />}
              endContent={
                <Button isIconOnly variant="light" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 text-default-500" /> : <Eye className="h-4 w-4 text-default-500" />}
                </Button>
              }
              isInvalid={!!errors.passwordConfirmation}
              errorMessage={errors.passwordConfirmation?.message}
              {...register("passwordConfirmation")}
              className="w-full"
            />
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-[#046fee] mt-0.5" />
            <p className="text-sm text-default-600">By signing up, you agree to our Terms of Service and Privacy Policy</p>
          </div>

          <Button type="submit" color="primary" className="w-full bg-[#006fee] text-white" isLoading={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardBody>

      <Divider />

      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-default-600">
          Already have an account?
          <Link href="/sign-in" className="text-[#046fee] hover:underline font-medium"> Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
