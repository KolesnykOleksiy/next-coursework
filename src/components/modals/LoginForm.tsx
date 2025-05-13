'use client'
import { useForm } from 'react-hook-form'
import {login} from '@/app/registration/actions'

import { useRouter } from 'next/navigation'

type Inputs = {
    email: string
    password: string
}
type Props = {
    onClose?: () => void;
}

export default function LoginForm({onClose}:Props) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>()

    const router = useRouter()
    //const [errorMessage, setErrorMessage] = useState<string | null>(null)

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    {/*{errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}*/}

                    <div>
                        <button formAction={login}
                            type="submit"
                            className="w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <a href="/registration" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    )
}
