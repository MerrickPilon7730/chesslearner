
import Image from "next/image";
import Link from "next/link";

// Header for website
export function HeaderLogo() {
    return(
        <Link href="/">
            <div className="items-center lg:flex">
                <Image src="/logo.jpg" alt='Back-Rank Chess Logo' height={28} width={28} className="hidden lg:flex"></Image>
                <p className="font-semibold text-white text-2xl ml-4">
                    Back-Rank Chess
                </p>
            </div>
        </Link>
    )
}