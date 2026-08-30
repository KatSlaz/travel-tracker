import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">

            {/* clicking the title takes user back to the home page. */}
            <div className="navbar-title">
                <h2><Link to="/">TravelTracker</Link></h2>
            </div>
            
            {/* displays the user account name. */}
            <div className="navbar-account">
                <p>AccountName</p>
            </div>
        </nav>
    )
}

export default Navbar;