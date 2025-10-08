"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { BeatLoader } from 'react-spinners'

export default function signup() {

    const router = useRouter()
    const [formData, setFormData] = useState({
        otp: ""
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
        const ToastId = toast.loading('Verifying your account...')

        try {
            const res = await axios.post('api/verify-email', formData)
            toast.success('🥳 Your account is Verified!!!', { id: ToastId })
            router.push('/')
            console.log(res)

        } catch (error: any) {
            console.log("Error in verify-email page:", error)
            toast.error(`❌ ${error.message}`, { id: ToastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-[#0f1117]">
            <div className="logo flex py-2 gap-1 items-center mb-4">
                <h1 className="text-3xl font-medium text-zinc-50">PassGen</h1>
            </div>

            <div className="w-full max-w-md px-6 py-8 border border-[#363f49] rounded-xl bg-[#12161d] shadow-md">
                <h4 className="text-3xl font-semibold text-zinc-100 text-center mb-6">Verify Email</h4>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col">
                        <label htmlFor="otp" className="text-zinc-400 mb-1">Verification code:</label>
                        <input
                            type="number"
                            name="otp"
                            value={formData.otp}
                            onChange={handelChange}
                            required
                            className="border-2 border-[#363f49] rounded-lg py-2 px-3 text-lg font-medium focus:outline-blue-500"
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
                </form>
            </div>
        </div>
    )
}