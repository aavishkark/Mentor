
import './profile.css';
import '../../components/AnalyticsDashboard/AnalyticsDashboard.css';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserCompanions, getUserSessions, getUserAnalytics, getMentorRecommendations } from '@/lib/actions/companion.action';
import Image from 'next/image';
import MentorList from "@/components/MentorsList/MentorList";
import AnalyticsDashboard from '@/components/AnalyticsDashboard/AnalyticsDashboard';
import RecommendedMentors from '@/components/RecommendedMentors/RecommendedMentors';

const ProfilePage = async () => {
  const user = await currentUser();
  if (!user) redirect('/login');

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
  const analyticsData = await getUserAnalytics(user.id);
  const recommendations = await getMentorRecommendations(6);

  return (
    <main className="profile">
      <section className="profile-header">
        <div className="profile-user">
          <Image src={user.imageUrl} alt={user.firstName!} width={110} height={110} />
          <div className="profile-info">
            <h1>{user.firstName} {user.lastName}</h1>
            <p>{user.emailAddresses[0].emailAddress}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-row">
              <Image src="/icons/check.svg" alt="checkmark" width={22} height={22} />
              <p className="stat-number">{sessionHistory.length}</p>
            </div>
            <div className="stat-label">Lessons Completed</div>
          </div>

          <div className="stat-card">
            <div className="stat-row">
              <Image src="/icons/cap.svg" alt="cap" width={22} height={22} />
              <p className="stat-number">{companions.length}</p>
            </div>
            <div className="stat-label">Mentors Created</div>
          </div>
        </div>
      </section>

      {recommendations.length > 0 && (
        <RecommendedMentors
          companions={recommendations}
          title="Explore New Mentors"
          showBadge={true}
        />
      )}

      <Accordion type="multiple" defaultValue={["analytics"]}>
        <AccordionItem value="analytics">
          <AccordionTrigger className="accordion-title">
            Learning Analytics
          </AccordionTrigger>
          <AccordionContent>
            <AnalyticsDashboard data={analyticsData} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="recent">
          <AccordionTrigger className="accordion-title">
            My Sessions ({sessionHistory.length})
          </AccordionTrigger>
          <AccordionContent>
            <MentorList title="Recent Sessions" companions={sessionHistory} showExport={true} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="companions">
          <AccordionTrigger className="accordion-title">
            My Mentors ({companions.length})
          </AccordionTrigger>
          <AccordionContent>
            <MentorList title="My Companions" companions={companions} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default ProfilePage;
