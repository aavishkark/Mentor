export const dynamic = 'force-dynamic';

import MentorTile from '@/components/MentorTile/MentorTile';
import MentorList from '@/components/MentorsList/MentorList';
import Cta from '@/components/Cta/Cta';
import './home.css';
import { getAllCompanions, getRecentSessions } from '@/lib/actions/companion.action';
import { getSubjectColor } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import { getUserCompanions, getUserSessions } from '@/lib/actions/companion.action';

const Home = async() => {
  
  const user = await currentUser();

  // if(user){
  //     const companions = await getUserCompanions(user.id);
  //     const sessionHistory = await getUserSessions(user.id);
  // }
  // else{
    
  // }
  const mentors = await getAllCompanions( { limit:3 } );
  const rescentSessionsMentors = await getRecentSessions(10);
  
  return (
    <main>
      <h1 className='text-2xl'>{user ? "Your Mentors" : "Example Mentors"}</h1>
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
        {
          !user ? "" :
        
        <MentorList 
          title = "Previously Completed Sessions"
          companions= {rescentSessionsMentors}
          classNames = "w-f2/3 max-lg:w-full"
        />
        }
        <Cta/>
      </section>
    </main>
  )
}
export default Home;
