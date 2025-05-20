'use client'

import HeaderButton from "@/components/header/HeaderButton";
import Link from "next/link";
import { usePathname } from 'next/navigation'

type Props = {
    onLoginClick?: () => void;
}

export default function HeaderMenu({ onLoginClick }: Props) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    return (
        <div className="flex md:flex space-x-4">
            {isAdmin ? (
                <>
                    <Link href="/admin/confirmed">
                    <HeaderButton>Confirmed</HeaderButton>
                    </Link>
                    <Link href="/private">
                        <HeaderButton>Таблиця</HeaderButton>
                    </Link>
                </>
            ) : (
                <>
                    <HeaderButton onClick={onLoginClick}>Увійти</HeaderButton>
                    <Link href="/registration">
                        <HeaderButton>Зареєструватись</HeaderButton>
                    </Link>
                </>
            )}
        </div>
    )
}
