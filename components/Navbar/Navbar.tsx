'use client';
import Link from 'next/link';
import Image from 'next/image';
import './navbar.css';
import NavItems from '../NavItems/NavItems';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [themeState, setThemeState] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setThemeState(savedTheme);
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (document.body.classList.contains('dark')) {
      document.body.classList.remove('dark');
      setThemeState('light');
      localStorage.setItem('theme', 'light');
    }
    else {
      document.body.classList.add('dark');
      setThemeState('dark');
      localStorage.setItem('theme', 'dark');
    }
  }
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
        <NavItems />
        <button className='theme-btn' onClick={toggleTheme}>{themeState == "dark" ? "Light" : 'Dark'}</button>
        <SignedOut>
          <SignInButton>
            <button className='btn-signin'>Sign In</button>
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