import UpdateProfile from './UpdateProfile.jsx'
import PublicProfile from './PublicProfile.jsx'
import AddDependent from './AddDependent.jsx'
import UpdateDependentBioPage from './UpdateDependentBio.jsx'
import CaregiverProfile from './CaregiverProfile.jsx'

const profileRoutes = [
  { path: '/UpdateProfile', Component: UpdateProfile, exact:'false'},
  { path: '/AddDependent', Component: AddDependent, exact:'false'},
  { path: '/UpdateDependentBio', Component: UpdateDependentBioPage, exact:'false'},
  { path: '/PublicProfile/:dependent_public_id', Component: PublicProfile, exact:'false'},
  { path: '/PublicProfile/:dependent_public_id/CaregiverProfile', Component: CaregiverProfile, exact:'false'}
];

export default profileRoutes;