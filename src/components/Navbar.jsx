import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-title">
                <h2><Link to="/">TravelTracker</Link></h2>
            </div>
            
            <div className="navbar-account">
                <p>AccountName</p>
            </div>
        </nav>
    )
}

export default Navbar;