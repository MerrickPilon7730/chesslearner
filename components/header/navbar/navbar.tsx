
import { usePathname } from "next/navigation";
import { NavButton } from "./nav-button";

const navLinks = [
    {
        name: "Play",
        href: "/"
    },
    {
        name: "Learn",
        href: "/learn"
    }
]

export function Navbar() {
    const pathName = usePathname();

    return(
        <div className="flex items-center gap-x-5">
            {navLinks.map((link) =>(
                <NavButton 
                    key={link.href}
                    href={link.href}
                    label={link.name}
                    isActive={link.href === pathName}
                />
            ))}
        </div>
    )
};