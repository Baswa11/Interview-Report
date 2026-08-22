import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLogIn, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../Hooks/useAuth.js'

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { handleLogin, loading } = useAuth()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed. Please check your credentials.')
        }
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#090d13] text-slate-100">
                <div className="flex flex-col items-center gap-4">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
                    <p className="text-sm text-slate-400">Signing you in...</p>
                </div>
            </main>
        )
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#090d13] px-4 py-8 text-slate-100 sm:px-8">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#2b3444] bg-[#121820] shadow-2xl shadow-black/30">
                <header className="border-b border-[#2b3444] px-8 py-7">
                    <div className="mb-3 flex items-center justify-center gap-3">
                        <FiLogIn className="text-2xl text-pink-500" />
                        <h1 className="text-2xl font-bold tracking-tight">
                            Welcome back
                        </h1>
                    </div>
                    <p className="text-center text-sm text-slate-400">
                        Sign in to access your interview strategy
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-5 px-8 py-7">
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                            <FiAlertCircle className="shrink-0 text-base text-red-400" />
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold"
                        >
                            Email
                        </label>
                        <input
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg border border-[#2a3346] bg-[#1d2435] px-4 py-3 text-sm outline-none placeholder:text-slate-400/80 transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold"
                        >
                            Password
                        </label>
                        <input
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-lg border border-[#2a3346] bg-[#1d2435] px-4 py-3 text-sm outline-none placeholder:text-slate-400/80 transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-pink-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-pink-950/30 transition hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-[#121820]"
                    >
                        <FiLogIn />
                        Login
                    </button>
                </form>

                <footer className="border-t border-[#2b3444] px-8 py-5 text-center">
                    <p className="text-sm text-slate-400">
                        Don&apos;t have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="font-semibold text-pink-500 transition hover:text-pink-400"
                        >
                            Register
                        </button>
                    </p>
                </footer>
            </div>
        </main>
    )
}

export default Login
