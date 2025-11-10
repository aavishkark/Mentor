import MentorForm from '@/components/MentorForm/MentorForm';
import './newmentor.css';

const NewMentor = () => {
  return (
    <main className='newmentor'>
      <article className='newmentor_article'>
        <h1>Mentor Form</h1>
        <MentorForm/>
      </article>
    </main>
  );
};

export default NewMentor;