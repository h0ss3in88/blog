import { useState, useEffect } from "react";
import { findPostsByPage} from './service'
import axios from 'axios';
import Post from "./post";
import Header from "./Header";
import Container from "./Container";

function Posts() {
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState(null);
  let [page, setPageNumber] = useState(1);
  let [posts, setPosts] = useState([]);
  let [refresh, setRefresh] = useState(false);

  
  useEffect(() => {
    async function getData() {
        try {
          const url =  `http://localhost:3300/api/posts`;
          const response = await axios.get(url, {
              headers : {
                  'Accept': 'application/json',
                  'Content-Type': /json/
              },
              params : {
                  page : 1
              }
          });
          if(response.status === 200) {
              console.log(response.data);
              setPosts([...[], ...response.data.posts]);
              if(refresh === true ){
                setPageNumber(1); 
                setRefresh(false);             
              }
              setError(null);
          }else {
              throw new Error(`This is an HTTP error: The status is ${response.status}`);
          }
      }catch(error) {
          setError(error.message);
          setPosts(null);
      }finally {
        setLoading(false);
      }
    }
    getData();
  }, [refresh]);
  useEffect(() => {
    async function loadMorePosts() {
      try{
        setLoading(true);
        let {allPosts} = await findPostsByPage({pageNumber : page});
        if(allPosts.length > 0) {
          setPosts([...posts,...allPosts]);
          setLoading(false);
        }
      }catch(err) {
        setError(err.message);
      }finally {
        setLoading(false);
      }
    }
    if(page > 1) {
      loadMorePosts();
    }

  }, [page])
  console.log(`page : ${page}`);
  console.log(`posts : ${posts?.length}`);

  


  if(error){
    const innerHtml = <div>Error occurred:{error}</div>
    return(<>
      <Header />
      <Container childComponent={innerHtml} />
    </>)
  }
  else if (loading) {
    const innerHtml = <div>LOADING POSTS ... </div>;
    return (
      <>
        <Header />
        <Container childComponent={innerHtml}></Container>
      </>
    );
  }else{
    const postsElements = posts.map((item, index) => {
      return <Post key={index} post={item} />;
    });
    const btnSection = (
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-primary text-uppercase"
          onClick={() => {setPageNumber(p => p+1)}}
        >
          LOAD MOORE
        </button>
      </div>
    );
    return (
      <>
        <Header />
        <button className = "btn btn-primary" onClick={() => { setRefresh(true)}}>Refresh</button>
        <Container childComponent={postsElements} />
        {btnSection}
      </>
    );
  }
}

export default Posts;
