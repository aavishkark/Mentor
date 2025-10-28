import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './navbar.css';
import NavItems from '../NavItems/NavItems';

const Navbar = () => {
  return (
    <nav className='navbar'>
        <Link href='/'>
            <div className='flex items-center gap-2 cursor-pointer'>
                <Image 
                    src={'/images/mentor.png'}
                    alt='logo'
                    width={46}
                    height={44}
                />
            </div>
        </Link>
        <div className='navitems'>
              <NavItems/>
        </div>
    </nav>
  );
};

export default Navbar;