import './Home.css'
import { Link } from 'react-router-dom'
import world from '../assets/world.svg'

function Home() {
  return (
    <div className="home">
        <header className="header-home">
          <h1>TravelTracker</h1>
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        </header>

        <main className="main-home">
        <img className="world-image" src={world} alt="image of the world in white"/>

          <p className="description">TravelTracker is your personal map of the world. Keep track of every place you've visited, 
            add dates and memories to your trips, and watch your travel history come to life. 
            Create private maps for yourself or shared maps with family and friends, so everyone can contribute 
            their adventures and see where you've been together. Whether you're documenting past journeys or planning the next one, 
            TravelTracker makes it easy to turn your travels into a map of your memories.</p>

          <Link to="/signup">
            <button className="get-started-button">Get Started</button>
          </Link>
        </main>
    </div>
  )
}

export default Home