type PropsText = {
    children: string;
    onClick?: () => void;
}
export default function HeaderButton({children, onClick}:PropsText){
    return(
        <div className="p-2">
            <button className="text-white bg-transparent border-2 border-white px-4 py-2 rounded hover:bg-orange hover:text-black transition cursor-pointer"
            onClick={onClick}>
                {children}
            </button>
        </div>
)
}