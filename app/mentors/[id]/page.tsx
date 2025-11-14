import './mentorslot.css'
import { getCompanion } from '@/lib/actions/companion.action';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getSubjectColor } from '@/lib/utils';
import MentorComponent from '@/components/MentorComponent/MentorComponent';
import Image from 'next/image';

interface CompanionSessionPageProps {
  params: Promise<{ id: string} >
}

const MentorSlot = async ({params}: CompanionSessionPageProps) => {
  const {id} = await params;
  const mentor = await getCompanion(id);
  const { name, subject, topic, duration } = mentor;
  const user = await currentUser();

  if(!user) redirect('/sign-in');
  if(!name) redirect('/mentors');
  return (
    <main>
      <article className="mentor-header">
        <div className="mentor-info">
          <div
            className="mentor-avatar"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <Image src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
          </div>

          <div className="mentor-details">
            <div className="mentor-name-row">
              <p className="mentor-name">{name}</p>
              <div className="subject-badge">{subject}</div>
            </div>

            <p className="mentor-topic">{topic}</p>
          </div>
        </div>

        <div className="duration-display">{duration} minutes</div>
      </article>

      <MentorComponent
        {...mentor}
        companionId={id}
        userName={user.firstName!}
        userImage={user.imageUrl!}
      />
    </main>

  );
};

export default MentorSlot;