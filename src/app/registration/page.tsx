'use client'
import { useForm, SubmitHandler } from "react-hook-form"
import {signup } from './actions'

type Inputs = {
    name: string
    email: string
    password: string
    password_confirmation: string
}

export default function Registration() {
    const {
        register,
        watch,
        formState: { errors },
        clearErrors,
    } = useForm<Inputs>()

    const password = watch("password");

    return (
        <div className="max-w-4xl max-sm:max-w-lg mx-auto p-6 mt-6">
            <div className="text-center mb-12 sm:mb-16">
                <h4 className="text-slate-600 text-base mt-6">Sign up into your account</h4>
            </div>

            <form>
                <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                        <label className="text-slate-800 text-sm font-medium mb-2 block">First Name</label>
                        <input
                            {...register("name", {
                                required: "Please enter your name",
                                maxLength: { value: 20, message: "Name must be at most 20 characters" }
                            })}
                            className="bg-input w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-orange-500 transition-all"
                            placeholder="Enter name" />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="text-slate-800 text-sm font-medium mb-2 block">Email</label>
                        <input type="email"
                               {...register("email", {
                                   required: "Please enter your email",
                               })}
                               className="bg-input w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-orange-500 transition-all"
                               placeholder="Enter email" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="text-slate-800 text-sm font-medium mb-2 block">Password</label>
                        <input {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                            maxLength: { value: 20, message: "Password must be at most 20 characters" }
                        })}
                               type="password"
                               className="bg-input w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-orange-500 transition-all"
                               placeholder="Enter password" />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label className="text-slate-800 text-sm font-medium mb-2 block">Confirm Password</label>
                        <input
                            {...register("password_confirmation", {
                                required: "Please confirm your password",
                                validate: value => value === password || "Passwords do not match"
                            })}
                            type="password"
                            className="bg-input w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-orange-500 transition-all"
                            placeholder="Enter confirm password" />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
                        )}
                    </div>
                </div>

                <div className="mt-12">
                    <button formAction={signup} type="submit"
                            className="mx-auto block py-3 px-6 text-sm font-medium tracking-wider rounded text-white bg-orange hover:bg-black focus:outline-none cursor-pointer">
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
}
