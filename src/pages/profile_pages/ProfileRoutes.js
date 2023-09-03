import UpdateProfile from './UpdateProfile.jsx'
import AddDependent from './AddDependent.jsx'

const profileRoutes = [
  { path: '/UpdateProfile', Component: UpdateProfile, exact:'false'},
  { path: '/AddDependent', Component: AddDependent, exact:'false'},
];

export default profileRoutes;