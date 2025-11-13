import './mentors.css';
import SearchInput from '@/components/SearchInput/SearchInput';
import TopicFilter from '@/components/TopicFilter/TopicFilter';
import { getAllCompanions } from '@/lib/actions/companion.action';
import MentorTile from '@/components/MentorTile/MentorTile';
import { getSubjectColor } from '@/lib/utils';

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Mentors = async ({ searchParams }: SearchParams) => {

  const filters = await searchParams;

  const subject = filters.subject ? filters.subject : '';
  const topic = filters.topic ? filters.topic : '';

  const mentors = await getAllCompanions({subject, topic});

  return (
    <main>
      <section className='flex justify-between gap-4 max-sm:flex-col'>
        <h1>Mentor Library</h1>
        <div className='flex gap-4'>
          <SearchInput />
          <TopicFilter />
        </div>
      </section>
      <section className='companion-grid'>
        {mentors.map((mentor)=>(
          <MentorTile key={mentor.id}
            {...mentor}
             color={getSubjectColor(mentor.subject)}
            />
        ))}
      </section>
    </main>
  );
};

export default Mentors;