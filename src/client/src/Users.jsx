
import {DateTime} from 'luxon';
import Header from './Header';
import Container from './Container'

function User({user}) {
    let {_id, email, profile, created_at ,lastLoginAt, loginCount} = user;
    return(
        <li>
            <p>Id : {_id}</p>
            <p>Email : {email}</p>
            <p>First Name : {profile.firstName}</p>
            <p>Last Name : {profile.lastName}</p>
            <p>Creation Date : {DateTime.fromISO(created_at)}</p>
            <p>Last Login At : {DateTime.fromISO(lastLoginAt)}</p>
            <p>{loginCount}</p>
        </li>);
}
function Users({items}) {
    const usersElements = 
    <ul>
        {
            items.map((user,index) => {
                return <User key={index} user={user} />;
            })
        }
    </ul>;
    return (
        <>
          <Header />
          <Container childComponent={usersElements}/>
        </>
    );
}
export default Users;