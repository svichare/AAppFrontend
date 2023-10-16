import OpenAICaregiver from './OpenAICaregiver.jsx'

const openAIRoutes = [
  { path: '/PublicProfile/:dependent_public_id/OpenAICaregiver', Component: OpenAICaregiver, exact:'true'}
];

export default openAIRoutes;
