import './Login.css'
import { Link } from 'react-router-dom'

function Login() {
    return (
        <div>
            <header className="header-login">
                <h1>Log in!</h1>
                <Link to="/">
                    <button className="home-button-login">Home</button>
                </Link>
            </header>
            <main className="main-login">
                <p>Sign in to continue.</p>
                <h2>Email Address</h2>
                <input type="email" placeholder="Enter your email"/>
                <h2>Password</h2>
                <input type="password" placeholder="Enter your password"/>
                <Link to="/map">
                    <button className="signup-button">Sign In</button>
                </Link>
                <p>Dont have an account? <Link to="/signup">Sign up</Link></p>
            </main>
        </div>
    )
}

export default Login