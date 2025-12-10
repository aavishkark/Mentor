'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import './navitems.css'

const navItems = [
    { label: 'Home', href: '/', protected: false },
    { label: 'Mentors', href: '/mentors', protected: false },
    { label: 'Notes', href: '/notes', protected: true },
    { label: 'Profile', href: '/profile', protected: true },
]

const NavItems = () => {
    const route = usePathname();
    const router = useRouter();
    const { isSignedIn } = useUser();

    const handleClick = (e: React.MouseEvent, href: string, isProtected: boolean) => {
        if (isProtected && !isSignedIn) {
            e.preventDefault();
            router.push('/login');
        }
    };

    return (
        <nav className="navitems">
            {navItems.map(({ label, href, protected: isProtected }) => (
                <Link
                    href={href}
                    key={label}
                    className={cn(route === href && 'text-primary font-semibold')}
                    onClick={(e) => handleClick(e, href, isProtected)}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems
