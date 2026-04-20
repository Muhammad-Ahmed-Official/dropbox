"use client"

import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { Input } from '@heroui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import toast from 'react-hot-toast'
import { useUserContext } from '@/contextApi/UserProvider'

export function SignInForm() {
  const router = useRouter()
  const { refetch } = useUserContext()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: "", password: "" }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.message || 'Sign in failed')
        return
      }
      await refetch()
      router.push('/dashboard')
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <Card className="w-full max-w-md border border-default-200 p-4 bg-default-50 shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <h1 className="text-2xl font-bold text-default-900">Welcome Back</h1>
        <p className="text-default-500 text-center">Sign in to access your secure cloud storage</p>
      </CardHeader>

      <Divider />

      <CardBody className="py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="identifier" className="text-sm font-medium text-default-900">Email or Username</label>
            <Input
              id="identifier"
              type="text"
              placeholder="your.email@example.com or username"
              startContent={<Mail className="h-4 w-4 text-default-500" />}
              isInvalid={!!errors.identifier}
              errorMessage={errors.identifier?.message}
              {...register("identifier")}
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

          <Button type="submit" color="primary" className="w-full bg-[#006fee] text-white" variant="flat" isLoading={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardBody>

      <Divider />

      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-default-600">
          {"Don't have an account?"}
          <Link href="/sign-up" className="text-[#046fee] hover:underline font-medium"> Sign up</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
