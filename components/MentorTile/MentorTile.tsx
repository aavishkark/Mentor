import Image from 'next/image';
import Link from 'next/link';
import './mentortile.css';

interface MentorTileProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
}

const MentorTile = ({ id, name, topic, subject, duration, color } : MentorTileProps) => {
  return (
    <article className='mentor-tile' style={{ backgroundColor: color }}>
      <div className='flex justify-between items-center'>
        <div className='sub-icon'>{subject}</div>
          <button className='mentor-bookmark'>
            <Image 
              src={"/icons/bookmark.svg"} 
              alt='bookmark'
              width={12.5}
              height={15}
            />
          </button>
      </div>
      <h2 className='text-2xl font-bold'>{name}</h2>
      <p className='text-sm'>{topic}</p>
      <div className='flex items-center gap-2'>
        <Image src={'icons/clock.svg'} alt='duration' width={13.5} height={13.5}/>
        <p className='textsm'>{duration} minutes</p>
      </div>
      <Link href={'/mentors/${id}'} className='w-full'>
        <button className='start-btn w-full justify-center'>
          Start Session
        </button>
      </Link>
    </article>
  );
};

export default MentorTile;