import { createSlice, PayloadAction, current } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import { Post } from '../../types/blog.type'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const initialState: BlogState = {
  postList: [],
  editingPost: null
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    deletePost: (state, action) => {
      const id = action.payload
      console.log('check id in reducer: ', id)
      const foundPostIndex = state.postList.findIndex((post) => post.id === id)
      if (foundPostIndex !== -1) {
        state.postList.splice(foundPostIndex, 1)
      }
    },
    editPost: (state, action) => {
      const id = action.payload
      console.log('check id in edit post line 32: ', id)
      const foundPost = state.postList.find((post) => post.id === id) || null
      state.editingPost = foundPost
    },
    cancelEditingPost: (state) => {
      state.editingPost = null
    },
    finishEditingPost: (state, action) => {
      const postId = action.payload.id
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload
          return true
        }
        return false
      })
      state.editingPost = null
    },
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        const post = action.payload
        state.postList.push(post)
      },
      prepare: (post: Omit<Post, 'id'>) => ({
        payload: {
          ...post,
          id: nanoid()
        }
      })
    }
  },
  extraReducers(builder) {
    builder
      .addCase('blog/getPostListSuccess', (state, action: any) => {
        console.log('check data inline 65: ', action.payload)
        state.postList = action.payload
      })
      .addMatcher(
        (action) => action.type.includes('cancel'),
        (state, action) => {
          console.log(current(state))
        }
      )
      .addDefaultCase((state, action) => {
        console.log(`action type ${action.type}`, current(state))
      })
  }
})

export const { addPost, deletePost, editPost, cancelEditingPost, finishEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer
export default blogReducer
