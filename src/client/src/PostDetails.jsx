import moment from 'moment';
import {useEffect} from 'react';
import {useLoaderData} from 'react-router-dom'
function PostDetails() {
    const {post} = useLoaderData();
    useEffect(() => {
        window.scrollTo({ top: 0 , left: 0, behavior: 'smooth'});
    }, []);
    return(<>
        <header className="masthead">
            <div className="container position-relative px-4 px-lg-5">
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        <div className="post-heading">
                            <h1>{post.title}</h1>
                            <h2 className="subheading">{post.description}</h2>
                            <span className="meta">
                                Posted by
                                <a href="#!">{post._id}</a>
                                <br /> 
                                {moment(post.release_date).format('MMMM Do YYYY')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <article className="mb-4">
            <div className="container px-4 px-lg-5">
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        {post.body.split('\n').map((v,i) => (<p key={i}>{v}</p>))}
                    </div>
                    <hr className='my-4' />
                    <div className='col-md-10 col-lg-8 col-xl-7'>
                        <div className='post-meta'>
                            <a href='#!'>{`  ${post.meta.vote}  `}</a>
                            Liked
                            <p className='post-meta'>
                                Tags : {post.tags.join(' ')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </>);
}


export default PostDetails;