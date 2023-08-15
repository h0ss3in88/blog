import axios from 'axios'

export async function savePost({post}) {
    try {
        const url =  `http://localhost:3300/api/posts`;
        const response = await axios.post(url, { post : post }, {
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 201) {
            console.log(response.data);
            return {post : response.data.post};
        }else {
            return new Error(response.status);
        }
        }catch(error) {
            return new Error(error);
        }
}
export async function getPostsCount() {
    try {
        const url = `http://localhost:3300/api/posts/count`;
        const response = await axios.get(url, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : /json/
            }
        });
        if(response.status === 200) {
            return response.data.count;
        }else {
            return new Error(response.status);
        }
    }catch(err) {
        return new Error(err);
    }
}
export async function findPostsByPage({pageNumber}) {
    try {
        const url =  `http://localhost:3300/api/posts`;
        const response = await axios.get(url, {
            headers : {
                'Accept': 'application/json',
                'Content-Type': /json/
            },
            params : {
                page : pageNumber
            }
        });
        if(response.status === 200) {
            console.log(response.data);
            return {allPosts : response.data.posts};
        }else {
            return new Error(response.status);
        }
        }catch(error) {
            return new Error(error);
        }
}
export async function postLoader() {
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
            const posts = response.data.posts;
            return posts;
        }else {
            return new Error(response.status);
        }
    }catch(error) {
        return new Error(error);
    }
}
export async function findPosts() {
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
            return {allPosts : response.data.posts};
        }else {
            return new Error(response.status);
        }
    }catch(error) {
        return new Error(error);
    }
}
export async function getPostById({params}) {
    try {
        const url =  `http://localhost:3300/api/posts/${params.postId}`;
        const response = await axios.get(url, {
            headers : {
                'Accept': 'application/json',
                'Content-Type': /json/
            }
        });
        if(response.status === 200) {
            console.log(response.data);
            return {post : response.data.post};
        }else {
            return new Error(response.status);
        }
    } catch (error) {
        return new Error(error);
    }
}