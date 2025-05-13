import HeaderButton from "@/components/header/HeaderButton";
import Link from "next/link";

type Props = {
    onLoginClick?: () => void;
}
export default function HeaderMenu({onLoginClick}:Props){
    return(
        <div className="flex md:flex space-x-4">
            <HeaderButton onClick={onLoginClick}>Увійти</HeaderButton>
            <Link href="/registration">
                <HeaderButton>Зареєструватись</HeaderButton>
            </Link>

        </div>
    )
}