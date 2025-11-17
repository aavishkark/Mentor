'use client';
import Link from 'next/link';
import Image from 'next/image';
import './navbar.css';
import NavItems from '../NavItems/NavItems';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useTheme } from '@/Context/ThemeContext';
const Navbar = () => {
  const { toggleTheme, theme } = useTheme();
  return (
    <nav className='navbar'>
        <Link href='/'>
            <div className='flex items-center gap-2 cursor-pointer'>
                <Image 
                    src={'/images/logo.jpg'}
                    alt='logo'
                    width={86}
                    height={44}
                />
            </div>
        </Link>
        <div className='navitems'>
              <NavItems/>
              <button className='theme-btn' onClick={toggleTheme}>{ theme == "dark" ? "Light" : 'Dark' }</button>
              <SignedOut>
                <SignInButton>
                    <button className='btn-signin'></button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
        </div>
    </nav>
  );
};

export default Navbar;