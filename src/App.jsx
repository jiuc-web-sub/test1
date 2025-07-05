import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './assets/css/App.css';
import './assets/css/variables.css';
import Trash from './pages/Trash';

function App() {
  return <RouterProvider router={router} />;
}

export default App;

<Route path="/trash" element={<Trash />} />