
import './profile.css';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserCompanions, getUserSessions } from '@/lib/actions/companion.action';
import Image from 'next/image';
import MentorList from "@/components/MentorsList/MentorList";

const ProfilePage = async() => {
  const user = await currentUser();
  if(!user) redirect('/login');

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
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

      <Accordion type="multiple">
        <AccordionItem value="recent">
          <AccordionTrigger className="accordion-title">
            My Sessions ({sessionHistory.length})
          </AccordionTrigger>
          <AccordionContent>
            <MentorList title="Recent Sessions" companions={sessionHistory} />
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