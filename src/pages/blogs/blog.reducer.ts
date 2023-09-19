import { createReducer, createAction } from '@reduxjs/toolkit'
import { Post } from '../../types/blog.type'
import { initalPostList } from 'constants/blogs'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const intialState: BlogState = {
  postList: initalPostList,
  editingPost: null
}

export const addPost = createAction<Post>('blog/AddPost')
export const deletePost = createAction<string>('blog/deletePost')
export const editPost = createAction<string>('blog/editPost')

const blogReducer = createReducer(intialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      //immerjs giup chung ta mutate mot state an toan
      const post = action.payload
      state.postList.push(post)
    })
    .addCase(deletePost, (state, action) => {
      const id = action.payload
      console.log('check id in reducer: ', id)
      const foundPostIndex = state.postList.findIndex((post) => post.id === id)
      if (foundPostIndex !== -1) {
        state.postList.splice(foundPostIndex, 1)
      }
    })
    .addCase(editPost, (state, action) => {
      const id = action.payload
      console.log('check id in edit post line 32: ', id)
      const foundPost = state.postList.find((post) => post.id === id) || null
      console.log('found post', foundPost)
      state.editingPost = foundPost
    })
})

export default blogReducer
