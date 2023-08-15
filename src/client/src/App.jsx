import Navigation from './Navigation';
import {Outlet} from 'react-router-dom';

// import logo from './logo.svg';
import './App.css';
import './blog.css';

function App() {
    return(<>
            <Navigation />
            <Outlet />
    </>);
}

export default App;
