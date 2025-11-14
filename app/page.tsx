export const dynamic = 'force-dynamic';

import MentorTile from '@/components/MentorTile/MentorTile';
import MentorList from '@/components/MentorsList/MentorList';
import Cta from '@/components/Cta/Cta';
import './home.css';
import { getAllCompanions, getRecentSessions } from '@/lib/actions/companion.action';
import { getSubjectColor } from '@/lib/utils';

const Home = async() => {

  const mentors = await getAllCompanions( { limit:3 } );
  const rescentSessionsMentors = await getRecentSessions(10);
  
  return (
    <main>
      <h1 className='text-2xl'>Your Mentors</h1>
      <section className='home-sec'>
        {mentors.map((mentor)=>(
            <MentorTile 
              key= {mentor.id}
              {...mentor}
              color={getSubjectColor(mentor.subject)}
            />
          ))}
      </section>
      <section className='home-sec'>
        <MentorList 
          title = "Recently Completed Sessions"
          companions= {rescentSessionsMentors}
          classNames = "w-f2/3 max-lg:w-full"
        />
        <Cta/>
      </section>
    </main>
  )
}
export default Home;
