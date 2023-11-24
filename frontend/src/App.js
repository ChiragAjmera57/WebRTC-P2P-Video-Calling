
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { Room } from './Room';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/room/:id' element={<Room />} />
    </Routes>
    </>
  );
}
 
export default App;
