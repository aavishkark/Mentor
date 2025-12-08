import MentorTile from '../MentorTile/MentorTile';
import { getSubjectColor } from '@/lib/utils';
import './RecommendedMentors.css';

interface Companion {
    id: string;
    name: string;
    subject: string;
    topic: string;
    duration: number;
    recommendationScore?: number;
}

interface RecommendedMentorsProps {
    companions: Companion[];
    title?: string;
    showBadge?: boolean;
}

const RecommendedMentors = ({
    companions,
    title = "Recommended for You",
    showBadge = true
}: RecommendedMentorsProps) => {
    if (!companions || companions.length === 0) {
        return null;
    }

    return (
        <section className='recommended-section'>
            <div className='recommended-header'>
                <h2 className='text-2xl font-bold'>{title}</h2>
                {showBadge && (
                    <span className='recommended-badge'>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z" fill="currentColor" />
                        </svg>
                        Personalized
                    </span>
                )}
            </div>
            <div className='recommended-grid'>
                {companions.map((mentor) => (
                    <MentorTile
                        key={mentor.id}
                        {...mentor}
                        color={getSubjectColor(mentor.subject)}
                    />
                ))}
            </div>
        </section>
    );
};

export default RecommendedMentors;
