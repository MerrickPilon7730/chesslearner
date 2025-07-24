
import Link from "next/link";

import { Button } from "@/components/ui/button";

type Props = {
    href: string,
    label: string,
    isActive: boolean,
};

export const NavButton = ({href, label, isActive}: Props) => {
    return (
        <Button variant={isActive ? "outline" : "default"}>
            <Link href={href}>
                {label}
            </Link>
        </Button>
    );
};