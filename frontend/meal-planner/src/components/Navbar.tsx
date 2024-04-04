import '../css/Navbar.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return(
        <nav className="nav">  
            <Link to="/" className="site-title">
            Meal Planner
            </Link>
            <ul>
                <li className='active'>
                    <Link to="/">User Profile</Link>
                </li> 
                <li>  
                    <Link to="/currentmeals">Current Week Meals</Link>
                </li>
                <li>
                    <Link to="/">About</Link>
                </li>
            </ul>
        </nav>
    )
}