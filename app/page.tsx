import Hero from '@/components/sections/Hero'
import Intro from '@/components/sections/Intro'
import Story from '@/components/sections/Story'
import Details from '@/components/sections/Details'
import Venue from '@/components/sections/Venue'
import RSVP from '@/components/sections/RSVP'
import MusicRequests from '@/components/sections/MusicRequests'
import CoupleQuiz from '@/components/sections/CoupleQuiz'

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Story />
      <Details />
      <Venue />
      <MusicRequests />
      <CoupleQuiz />
      <RSVP />
    </>
  )
}
