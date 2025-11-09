import MentorForm from '@/components/MentorForm/MentorForm';
import './newmentor.css';
const NewMentor = () => {
  return (
    <main className='newmentor'>
      <article className='w-full gap-4 flex flex-col'>
        <h1>Companion Form</h1>
        <MentorForm/>
      </article>
    </main>
  );
};

export default NewMentor;