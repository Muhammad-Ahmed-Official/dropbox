import z from "zod";

export const signUpSchema = z.object({ 
    email: z.email({message: "Please enater a valid email"}).min(1, {message: "Email is required"}),
    password: z.string().min(1, {message: "Password is required"}).min(8, {message: "Password length should be 8 characters"}),
    passwordConfirmation: z.string().min(1, {message: "Password confirm your password"}) 
})
.refine((data) => data.password === data.passwordConfirmation, {
    message: "Password donnot match",
    path: ["passwordConfirmation"],
})