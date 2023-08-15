import moment from 'moment';
import {Link} from "react-router-dom";

function Post({post}) {
    const postLink = `/posts/${post._id}`;
    return(
      <><div className='post-preview'>
        <Link to={postLink}>
          <h2 className='post-title'> {post.title}</h2>
          <h3 className='post-subtitle'>{post.description}</h3>
        </Link>
        <p className='post-meta'>
          Posted by
          <a href='#!'>{`  ${post.author}  `}</a>
          {moment(post.release_date).format('MMMM Do YYYY')}
        </p>
      </div><hr className='my-4' /></>
    )
}

export default Post;