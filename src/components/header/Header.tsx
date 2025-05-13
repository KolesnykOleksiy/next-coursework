"use client"
import Logo from "@/components/header/Logo";
import HeaderMenu from "@/components/header/HeaderMenu";
import {useState} from "react";
import LoginForm from "@/components/modals/LoginForm";
import Link from "next/link";
export default function Header(){
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const handleCloseModal = () => setIsLoginModalOpen(false)
    return(
        <div className="w-full h-[120px] bg-[#000000] p-4 flex items-center justify-between">
            <Link href="/"><Logo></Logo></Link>
            <HeaderMenu onLoginClick={() => setIsLoginModalOpen(true)}></HeaderMenu>
            {isLoginModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                        <button className="absolute top-2 right-2 text-black cursor-pointer" onClick={() => handleCloseModal()}>✖</button>
                        <LoginForm onClose={handleCloseModal} />
                    </div>
                </div>
            )}
        </div>
    )
}