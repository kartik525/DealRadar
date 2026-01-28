"use client"
import React from 'react'
import { Button } from './ui/button'
import { LogIn, LogOut } from 'lucide-react'
import AuthModal from './AuthModal'
import { SignOut } from '@/app/actions'

const AuthButton = ({ user }: any) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)
    const handleLogOut = async () => {
        await SignOut()
    }

    if (user) {
        return (
            <Button variant="ghost" size="sm" className="bg-orange-500 hover:bg-blue-950" onClick={handleLogOut}><LogOut className="w-4 h-4" />Sign Out</Button>

        )
    }

    return (
        <>
            <Button variant="default" size="sm" className="bg-orange-500 hover:bg-blue-950 cursor-pointer" onClick={() => (setIsAuthModalOpen(true))}><LogIn className="w-4 h-4" />Sign In</Button>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>

    )
}

export default AuthButton