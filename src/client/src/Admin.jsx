import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import {findPosts, getPostsCount} from "./service";
import Header from "./Header";
import Container from "./Container";

function Admin() {
    let [refresh, setRefresh] = useState(false);
    let [posts, setPosts] = useState([]);
    let [loading, setLoading] = useState(false);
    let [count, setCount] = useState(0);
    let [error, setError] = useState(null);

    useEffect(() => {
        async function loadPosts() {
            try {
                setLoading(true);
                let {allPosts} = await findPosts();
                let pCount = await getPostsCount();
                setCount(pCount);
                setPosts([...posts, ...allPosts]);
            }catch(err) {
                setError(err);
            }finally{
                setLoading(false);
            }
        } 
        loadPosts();
    }, [refresh]);
    if(loading) {
        const innerHtml = <div>LOADING ... </div>;
        return (
          <>
            <Header />
            <Container childComponent={innerHtml}></Container>
          </>    
    )}else if(error){
        const innerHtml = <div>Error occurred:{error}</div>
        return(<>
            <Header />
            <Container childComponent={innerHtml} />
        </>)
    }else { 
        const innerHtml = <><div className="row"><span>Posts COUNT {count}</span></div>
         <PostsTable data={posts} postsCounts={count} /></>;
        return (<>
        <Header />
        <button className="btn btn-primary" onClick={() => setRefresh(true)}>Refresh</button>
        <Container childComponent={innerHtml}></Container>
        </>)
    }
}
function PostsTable({data, postsCounts}) {
    console.log(data.count);
    return(<>
        <table className="table">
            <thead className="thead-dark">
                <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">Release AT</th>
                <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>{
                data.map((post, index) => {
                    return( 
                    <tr key={index}>
                        <th scope="row">{index+1}</th>
                        <td>{post.title}</td>
                        <td>{`${post.description.substring(1, 55)} ...`}</td>
                        <td>{post.hidden ? `Inactive` : `Active`}</td>
                        <td>{post.release_date}</td>
                        <td><Link className="btn btn-sm btn-info" to={`/posts/${post._id}`}>Edit</Link></td>
                    </tr>);
                })
            }</tbody>
        </table>
        <PostsTablePagination count={postsCounts} />
    </>)
}

function PostsTablePagination({count}) {
    let page = Math.ceil(count / 10);
    let content = Array.from({length : page}, (_, index) => index+1).map((v, i) => {
        return (<li key={i+1} id={v} className="page-item"><a className="page-link" href="#">{v}</a></li>);
    });
    
    const template =  <nav aria-label="...">
    <ul className="pagination">
      <li className="page-item disabled">
        <a className="page-link" href="#" tabIndex="-1">Previous</a>
      </li>
      {content}
      <li className="page-item">
        <a className="page-link" href="#">Next</a>
      </li>
    </ul>
  </nav>;
  return (<>{template}</>)
}
export default Admin;