import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/client'

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const supabase = createClient()
    const handleGoogleLogin = async () => {
        const { origin } = window.location
        console.log(origin, "origin");

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${origin}/auth/callback`
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign in to continue</DialogTitle>
                    <DialogDescription>
                        Track product prices and get notified when they drop
                    </DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-4 py-4'>
                    <Button variant='outline' size={'lg'} className='w-full gap-2' onClick={handleGoogleLogin} >
                        Continue with Google
                    </Button>

                </div>

            </DialogContent>

        </Dialog>

    )
}

export default AuthModal