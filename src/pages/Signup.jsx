import './Signup.css'
import { Link } from 'react-router-dom'

function Signup() {
    return (
        <div>
            <header className="header-signup">
                <h1>Create an account!</h1>
                <Link to="/">
                    <button className="home-button-signup">Home</button>
                </Link>
            </header>
            <main className="main-signup">
                <p>Sign up to continue.</p>
                <h2>Email Address</h2>
                <input type="email" placeholder="Enter your email"/>
                <h2>Password</h2>
                <input type="password" placeholder="Enter your password"/>
                <Link to="/map">
                    <button className="signup-button">Join Now!</button>
                </Link>
                <p>Already have an account? <Link to="/login">Log in</Link></p>
            </main>
        </div>
    )
}

export default Signup