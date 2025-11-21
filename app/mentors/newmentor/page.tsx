import MentorForm from '@/components/MentorForm/MentorForm';
import './newmentor.css';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { newCompanionPermissions } from '@/lib/actions/companion.action';
import Image from 'next/image';
import Link from 'next/link';

const NewMentor = async() => {
  const { userId } = await auth();
  if(!userId) redirect('/login');

   const canCreateCompanion = await newCompanionPermissions();

  return (
    <main className='newmentor'>
      {canCreateCompanion ? (
        <article className='w-full gap-4 flex flex-col'>
          <MentorForm />
        </article>
      ):(
        <article className='mentor-limit'>
          <Image src={"/images/limit.svg"} alt='companion limit reached'
            width={360} height={230}
          />
          <div className='cta-badge'>
            Upgrade Your Plan
          </div>
          <h1>You&apos;ve Reached Your Limit</h1>
          <p>You&apos;ve Reached Your Companion Limit , Upgrade To Create More Companiona & Access Premium Features</p>
          <Link href={'/subscription'} className='btn-primary w-full justify-center'>
            Upgrade My Plan
          </Link>
        </article>
      )}
    </main>
  );
};

export default NewMentor;