import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './cta.css'

const CTA = () => {
  return (
    <section className='cta-sec'>
        <div className='cta-icon'>Self Learning Redefined</div>
        <h2 className='text-3xl font-bold'>
            Create Your Own Mentors
        </h2>
        <p>
            Choose a name, subject, voice, and personality —
            then start learning through engaging,
             natural voice conversations that make education fun.
        </p>
        <Image 
            src="/images/cta.svg"
            alt='cta'
            width={362}
            height={232}
        />
        <button className='cta-btn'>
            <Image 
                src={"/icons/plus.svg"}
                alt='"plus'
                width={12}
                height={12}
            />
            <Link href={'/companions/new'}>
                <p>Create Companion</p>
            </Link>
        </button>
    </section>
  );
};

export default CTA;