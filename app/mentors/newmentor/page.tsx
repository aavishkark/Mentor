import MentorForm from '@/components/MentorForm/MentorForm';
import './newmentor.css';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const NewMentor = async() => {
  const { userId } = await auth();
  if(!userId) redirect('/login');

  return (
    <main className='newmentor'>
      <article className='newmentor_article'>
        <MentorForm/>
      </article>
    </main>
  );
};

export default NewMentor;