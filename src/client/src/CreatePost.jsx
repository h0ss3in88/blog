import { useState } from "react";
import Header from './Header'
import Container from './Container'
import {savePost} from './service';
function CreatePost() {
    let [post, setPost] = useState({});

    const handleChange = function(event) {
        const name = event.target.name;
        const value = event.target.value;
        setPost((values) => ({...values, [name] : value }));
    }
    const handleChecked = function(e) {
        const name = e.target.name;
        const value = e.target.checked;
        setPost((values) => ({...values, [name] : value }));
    }
    const handleChangeForTags = function(e) {
        const name = e.target.name;
        const value = e.target.value;
        setPost((values) => ({...values, [name] : value.split(',') }));
    }
    const saveNewPost = function(event) {
        event.preventDefault();
        console.log(JSON.stringify(post));
        savePost({post}).then(result => {
            const id = result.post._id;
            setPost((values) => ({...values, ["_id"] : id }));
            console.log(post._id);
            alert(`your new post created successfully and will published at ${post.release_date}`);
            console.log(JSON.stringify(post));
        }).catch(error => {
            console.log(error);
            alert(error);
        });
    }
    const formSection = 
    <form id="createPostForm" onSubmit={saveNewPost}>
    <div className="form-group">
    <label htmlFor="title">
            Title : 
        </label>
        <input type="text" value={post.title || ""} className="form-control" id="title" name="title" onChange={handleChange}/>
    </div>
    <div className="form-group">
        <label htmlFor="description">
            Description : 
        </label>
        <textarea type="text" value={post.description || ""} className="form-control" id="description" name="description" onChange={handleChange} />

    </div>
    <div className="form-group">
        <label htmlFor="body">
            Body : 
        </label>
        <textarea type="text" value={post.body || ""} className="form-control" id="body" name="body" onChange={handleChange} />
    </div>
    <div className="form-group">
    <input type="checkbox"  className="form-check-input" id="hidden" name="hidden" onChange={handleChecked}/>
    <label className="form-check-label" htmlFor="hidden">
            To Draft 
        </label>
    </div>
    <div className="form-group">
        <label htmlFor="tags">
            Tags : 
        </label>
        <input type="text" value={post.tags || []} className="form-control" id="tags" name="tags" onChange={handleChangeForTags} />
        <small id="tagsHelp" className="form-text text-muted">Your tags should be separated by , </small>
    </div>
    <div className="form-group">
        <label htmlFor="release_date">
            Release Date : 
        </label>
        <input type="date" value={post.release_date || ""} className="form-control" id="release_date" name="release_date" onChange={handleChange} />
    </div>
    <input type="submit" className="btn btn-primary" value="Submit"  />
    </form>;
    return(
        <>
        <Header />
        <Container childComponent={formSection} />
        </>);
}

export default CreatePost;