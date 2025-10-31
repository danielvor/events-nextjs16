import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <header>
            <nav>
                <Link href='/' className="logo">
                    <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

                    <p>DevEvent</p>
                </Link>

                <ul>
                    <Link href="/">Início</Link>
                    <Link href="/">Eventos</Link>
                    <Link href="/">Criar Evento</Link>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar