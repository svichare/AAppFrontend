import JourneyList from './JourneyList.jsx'
import CommJourney from './CommJourney.jsx'
import PottyJourney from './PottyJourney.jsx'
import SleepJourney from './SleepJourney.jsx'
import FeedingJourney from './FeedingJourney.jsx'


const journeyRoutes = [
  { path: '/PublicProfile/:dependent_public_id/JourneyList', Component: JourneyList, exact:'true'},
  { path: '/PublicProfile/:dependent_public_id/CommJourney', Component: CommJourney, exact:'true'},
  { path: '/PublicProfile/:dependent_public_id/PottyJourney', Component: PottyJourney, exact:'true'},
  { path: '/PublicProfile/:dependent_public_id/SleepJourney', Component: SleepJourney, exact:'true'},
  { path: '/PublicProfile/:dependent_public_id/FeedingJourney', Component: FeedingJourney, exact:'true'}

];

export default journeyRoutes;
