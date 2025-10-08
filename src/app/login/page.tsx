"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { BeatLoader } from 'react-spinners'

export default function signup() {

    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false)

    const handelChange = (e: any) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        const ToastId = toast.loading('Logging your account...')

        try {
            const res = await axios.post('api/login', formData)
            toast.success('🥳 Welcome back!!!', { id: ToastId })
            router.push('/')
            console.log(res)
            
        }catch (error: any) {
            console.log("Error in Login page:", error)
            const message = error?.response?.data?.error || error?.message || "Something went wrong."
            toast.error(`${message}`, { id: ToastId })
        }finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-6 bg-[#0f1117]">
            <div className="logo flex items-center justify-center gap-1 mb-6">
                <h1 className="text-3xl font-medium text-zinc-50">PassGen</h1>
            </div>

            <div className="w-full max-w-md bg-[#12161d] border 
            border-[#363f49] rounded-xl px-6 py-8 shadow-md
            flex flex-col items-center justify-center">
                <h3 className="text-3xl font-semibold text-zinc-100 text-center mb-6">Login</h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-zinc-400 mb-1">Email:</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handelChange}
                            required
                            placeholder="abcd123@gmail.com"
                            className="w-full border-2 border-[#363f49] rounded-lg py-2 px-3 text-lg font-medium focus:outline-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-zinc-400 mb-1">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handelChange}
                            required
                            placeholder="Password"
                            className="w-full border-2 border-[#363f49] rounded-lg py-2 px-3 text-lg font-medium focus:outline-blue-500"
                        />
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="w-full py-2 rounded-xl bg-blue-600 text-zinc-100 font-medium text-xl hover:bg-blue-700 transition"
                        >
                            {loading ? <BeatLoader color="#ffffff" size={10} /> : "Submit"}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-zinc-400">Or</p>
                        <p className="text-zinc-500">
                            Don't have an account? <a href="/signup" className="text-blue-600">Signup here</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}