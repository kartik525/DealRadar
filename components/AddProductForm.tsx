"use client"
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { addProduct } from '@/app/actions'
import AuthModal from './AuthModal'
import { toast } from 'sonner'

const AddProductForm = ({ user }: any) => {
    console.log("herr");


    const [url, setUrl] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [authModalOpen, setAuthModalOpen] = React.useState(false)


    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault()

            if (!user) {
                setAuthModalOpen(true)
                return
            }
            setLoading(true)
            const formData = new FormData()
            formData.append("url", url)
            const result: any = await addProduct(formData)
            console.log(result, "result");

            if (result?.error) {
                toast.error(result.error)
                setLoading(false)
            }
            else {
                toast.success("Product added successfully")
                setUrl('')
                setLoading(false)
            }
        }
        catch (e: any) {
            toast.error(e.message)
            setLoading(false)
        }
    }
    return (
        <form onSubmit={handleSubmit} className='max-w-3xl mx-auto'>
            <div className='flex flex-col sm:flex-row gap-2'>
                <Input type='url'
                    value={url}
                    onChange={(e) => { setUrl(e.target.value) }}
                    placeholder='Paste Product URL (Amazon,Walmart, etc.)'
                    className='h-12 text-base'
                    required
                // disabled={loading}
                />
                <Button type='submit' variant={"default"} disabled={loading} className='bg-orange-500 h-12 hover:bg-blue-950 cursor-pointer'>
                    {loading ? <><Loader className='animate-spin w-2 h2' /><span className='sr-only'>Tracking...</span></> : "Track Product"}
                </Button>
                <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            </div>
        </form>

    )
}

export default AddProductForm