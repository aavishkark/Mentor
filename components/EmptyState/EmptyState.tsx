import Image from 'next/image';
import Link from 'next/link';
import './EmptyState.css';

interface EmptyStateProps {
    title: string;
    description: string;
    actionText?: string;
    actionHref?: string;
    icon?: string;
    showCreateButton?: boolean;
}

const EmptyState = ({
    title,
    description,
    actionText,
    actionHref,
    icon = '/icons/cap.svg',
    showCreateButton = false
}: EmptyStateProps) => {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">
                <Image src={icon} alt="Empty state" width={80} height={80} />
            </div>
            <h2 className="empty-state-title">{title}</h2>
            <p className="empty-state-description">{description}</p>
            {actionHref && actionText && (
                <Link href={actionHref} className="empty-state-link">
                    <button className="empty-state-button">
                        {showCreateButton && <span className="button-icon">+</span>}
                        {actionText}
                    </button>
                </Link>
            )}
        </div>
    );
};

export default EmptyState;
