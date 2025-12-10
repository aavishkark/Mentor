export const dynamic = 'force-dynamic';

import MentorTile from '@/components/MentorTile/MentorTile';
import MentorList from '@/components/MentorsList/MentorList';
import Cta from '@/components/Cta/Cta';
import RecommendedMentors from '@/components/RecommendedMentors/RecommendedMentors';
import EmptyState from '@/components/EmptyState/EmptyState';
import './home.css';
import { getAllCompanions, getRecentSessions, getMentorRecommendations, getUserCompanions } from '@/lib/actions/companion.action';
import { getSubjectColor } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';

const Home = async () => {
  const user = await currentUser();
  const mentors = user
    ? await getUserCompanions(user.id, 3)
    : await getAllCompanions({ limit: 3 });
  const rescentSessionsMentors = await getRecentSessions(10);
  const recommendations = user ? await getMentorRecommendations(6) : [];

  return (
    <main>
      {user && recommendations.length > 0 && (
        <RecommendedMentors companions={recommendations} />
      )}

      <h1 className='text-2xl'>{user ? "Your Mentors" : "Example Mentors"}</h1>
      <section className='home-sec'>
        {mentors && mentors.length > 0 ? (
          mentors.map((mentor) => (
            <MentorTile
              key={mentor.id}
              {...mentor}
              color={getSubjectColor(mentor.subject)}
            />
          ))
        ) : (
          <EmptyState
            title={user ? "No Mentors Yet" : "Get Started with AI Mentors"}
            description={
              user
                ? "Create your first AI mentor to start personalized learning sessions. Choose from various subjects and customize your learning experience."
                : "Sign in to create personalized AI mentors, start voice sessions, and track your learning progress. Experience the future of education."
            }
            actionText={user ? "Create Your First Mentor" : "Sign In to Get Started"}
            actionHref={user ? "/mentors/new" : "/login"}
            showCreateButton={user ? true : false}
          />
        )}
      </section>
      <section className='home-sec'>
        {user && rescentSessionsMentors && rescentSessionsMentors.length > 0 && (
          <MentorList
            title="Previously Completed Sessions"
            companions={rescentSessionsMentors}
            classNames="w-f2/3 max-lg:w-full"
            showExport={true}
          />
        )}
        {mentors && mentors.length > 0 && <Cta />}
      </section>
    </main>
  )
}
export default Home;
