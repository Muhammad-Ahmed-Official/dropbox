"use client"

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import z from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { asyncHandlerFront } from "@/utils/AsyncHandlerFront";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function signUpForm() {
    const[verifying, setVeirfying] = useState<Boolean>(false);
    const {signUp, isLoaded, setActive} = useSignUp();
    const [verificationCode, setVerificationCode] = useState("");
    const router = useRouter();
    // const [authError, setAuthError] = useState<string | null>();
    const { register, handleSubmit, watch, formState: {errors, isLoading}} = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        }
    })
    
    const onSubmit = async(data:z.infer<typeof signUpSchema>) => {
        if(!isLoaded) return;
        await asyncHandlerFront(
            async() => {
                signUp.create({
                    emailAddress: data?.email, 
                    password: data?.password,
                })
            }
        )
        await asyncHandlerFront(
            async() => {
                await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                })
                setVeirfying(true);
            }
        )
    }

    const handleVerificationSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!isLoaded && !signUp) return;

        await asyncHandlerFront(
            async() => {
                const result = await signUp.attemptEmailAddressVerification({
                    code: verificationCode,
                })

                if(result.status === "complete"){
                    await setActive({session: result?.createdSessionId});
                    router.push("/dashboard");
                }else {
                    toast.error("Verification incomplete");
                }
            }
        )
    }

    if(verifying){
        return(
            <h1>Email otp </h1>
        )
    }

    return(
        <h1>Signup form</h1>
    )
} 