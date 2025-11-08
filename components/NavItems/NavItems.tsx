'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import './navitems.css'

const navItems = [
    { label:'Home', href: '/' },
    { label: 'Mentors', href: '/mentors' },
    { label: 'Profile', href: '/profile' },
]

const NavItems = () => {
    const route = usePathname();

    return (
        <nav className="navitems">
            {navItems.map(({ label, href }) => (
                <Link
                    href={href}
                    key={label}
                    className={cn(route === href && 'text-primary font-semibold')}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems