import { MapInterface } from './components/Map/MapInterface';
import { NavigationBar } from './components/NavigationBar';

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-explorer-sand-50">
      <MapInterface />
      <NavigationBar />
    </div>
  )
}

export default App
