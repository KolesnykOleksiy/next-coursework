'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import {cookies} from "next/headers";

export async function login(formData: FormData) {
    const supabase = await createClient()
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword(data)

    if (authError) {
        redirect('/error')
    }
    const user = authData.user
    if (!user) redirect('/login')
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError) {
        redirect('/error')
    }

    if(profile.role === 'admin') {
        (await cookies()).set('role', profile.role, {
            path: '/',
            sameSite: 'lax',
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === 'production',
        })
        redirect('/admin')
    } else {
        redirect('/')
    }

}

export async function signup(formData: FormData): Promise<void> {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
        password_confirmation: formData.get('password_confirmation') as string,
    }

    if (!data.email || !data.password || !data.password_confirmation || !data.name) {
        throw new Error('All fields are required')
    }

    if (data.password !== data.password_confirmation) {
        throw new Error('Passwords do not match')
    }

    const { error, data: signupData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    })

    if (error) {
        if (error.message.includes("User already registered")) {
            throw new Error("User with this email already exists")
        }
        redirect('/error')
    }

    redirect('/confirm-email')
}