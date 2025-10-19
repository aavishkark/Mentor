'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
const navItems = [
    {label: 'Home', href: '/'},
    {label: 'Companions', href: '/companions'},
    {label: 'My journey', href: '/my-journey'}
]
const NavItems = () => {
    const pathname = usePathname();
  return (
    <nav className='flex items-center gap-8'>
        {navItems.map(({label, href}, _index)=>
            <Link
                href={ href }
                key={ _index }
                className = { cn (pathname === href && 'text-primary font-semibold')}
                    
            >{label}</Link>
        )}
    </nav>
  );
};

export default NavItems;