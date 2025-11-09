import React from 'react';
import MentorTile from '@/components/MentorTile/MentorTile';
import MentorList from '@/components/MentorsList/MentorList';
import Cta from '@/components/Cta/Cta';
import './home.css';

export const recentSessions = [
  {
    id: "1",
    subject: "science",
    name: "Neura the Brainy Explorer",
    topic: "Neural Network of the Brain",
    duration: 45,
    color: "#E5D0FF",
  },
  {
    id: "2",
    subject: "maths",
    name: "Countsy the Number Wizard",
    topic: "Derivatives & Integrals",
    duration: 30,
    color: "#FFDA6E",
  },
  {
    id: "3",
    subject: "language",
    name: "Verba the Vocabulary Builder",
    topic: "English Literature",
    duration: 30,
    color: "#BDE7FF",
  },
  {
    id: "4",
    subject: "coding",
    name: "Codey the Logic Hacker",
    topic: "Intro to If-Else Statements",
    duration: 45,
    color: "#FFC8E4",
  },
  {
    id: "5",
    subject: "history",
    name: "Memo, the Memory Keeper",
    topic: "World Wars: Causes & Consequences",
    duration: 15,
    color: "#FFECC8",
  },
  {
    id: "6",
    subject: "economics",
    name: "The Market Maestro",
    topic: "The Basics of Supply & Demand",
    duration: 10,
    color: "#C8FFDF",
  },
];

export default function Home() {
  return (
    <main>
      <h1 className='text-2xl underline'>Popular Companion</h1>
      <section className='home-section'>
        <MentorTile 
          id ="123"
          name = "Neura the Brainy Explorer"
          topic = "Neural Network of the Brain"
          subject = "Science"
          duration = {45}
          color = "#ffda6e"
        />
        <MentorTile
          id ="124"
          name = "Countsy of the Number Wizard"
          topic = "Derivatives & Integrals"
          subject = "Science"
          duration = {30}
          color = "#e5d0ff"
        />
        <MentorTile 
          id ="789"
          name = "Verba the Vocabulary Builder"
          topic = "Language"
          subject = "English Literature"
          duration = {20}
          color = "#bde7ff"
        />
      </section>
      <section className='home-section'>
        <MentorList 
          title = "Recently Completed Sessions"
          companions= {recentSessions}
          classNames = "w-f2/3 max-lg:w-full"
        />
        <Cta/>
      </section>
    </main>
  )
}
