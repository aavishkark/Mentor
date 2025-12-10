'use client';

import { useState, useEffect } from 'react';
import './mentorslot.css'
import { getCompanion, createSession } from '@/lib/actions/companion.action';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getSubjectColor } from '@/lib/utils';
import MentorComponent from '@/components/MentorComponent/MentorComponent';
import NotesPanel from '@/components/NotesPanel/NotesPanel';
import Image from 'next/image';
import { use } from 'react';

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>
}

const MentorSlot = ({ params }: CompanionSessionPageProps) => {
  const { id } = use(params);
  const { user, isLoaded } = useUser();
  const [mentor, setMentor] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      if (!isLoaded) return;

      try {
        const mentorData = await getCompanion(id);
        if (!mentorData?.name) {
          redirect('/mentors');
          return;
        }
        setMentor(mentorData);
      } catch (error) {
        console.error('Error initializing page:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [id, isLoaded]);

  if (loading || !mentor) {
    return (
      <main className="mentor-session-loading">
        <div className="loading-spinner"></div>
        <p>Loading session...</p>
      </main>
    );
  }

  const { name, subject, topic, duration } = mentor;

  return (
    <main className="mentor-session-layout">
      <div className="session-main-content">
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
          sessionId={sessionId || undefined}
          userName={user?.firstName || 'Guest'}
          userImage={user?.imageUrl || '/images/guest-avatar.png'}
          onSessionCreate={setSessionId}
        />
      </div>

      {user && sessionId && (
        <aside className="session-notes-sidebar">
          <NotesPanel
            sessionId={sessionId}
            companionId={id}
            companionName={name}
          />
        </aside>
      )}
    </main>

  );
};

export default MentorSlot;