import TraitCategories from './TraitCategories.jsx'
import TraitDetails from './TraitDetails.jsx'

const traitRoutes = [
  { path: '/TraitCategories', Component: TraitCategories, exact:'false'},
  { path: '/TraitDetails', Component: TraitDetails, exact:'false'},

];

export default traitRoutes;