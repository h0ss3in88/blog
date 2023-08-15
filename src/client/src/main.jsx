import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import App from './App.jsx'
import Posts from './Posts'
import Users from './Users' 
import PostDetails from './PostDetails'
import EditPost from './EditPost'
import CreatePost from './CreatePost'
import Admin from './Admin'

import {getPostById, postLoader} from './service'
const router = createBrowserRouter([{
  path : '/',
  Component: App,
  children : [{
    index: true,
    Component: Posts,
    loader: postLoader
  },
  {
    path: '/posts',
    element: <Posts />,
    loader: postLoader
  },
  {
    path : '/posts/:postId',
    loader : getPostById,
    element: <PostDetails />
  },{
    path : '/posts/edit/:postId',
    loader: getPostById,
    element: <EditPost />
  },{
    path: '/posts/create',
    element: <CreatePost />
  },{
    path: '/admin',
    element: <Admin />
  },
  {
    path: '/users',
    Component : Users
  }]
}]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
