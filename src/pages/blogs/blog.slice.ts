import { createSlice, current, createAsyncThunk } from '@reduxjs/toolkit'
import { Post } from '../../types/blog.type'
import http from 'utils/http'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const initialState: BlogState = {
  postList: [],
  editingPost: null
}

// Get blog when start app
export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
  const response = await http.get<Post[]>('posts', {
    signal: thunkAPI.signal
  })
  return response.data
})

//Create a new blog
export const addPost = createAsyncThunk('blog/addPost', async (body: Omit<Post, 'id'>, thunkAPI) => {
  const reponse = await http.post<Post>('posts', body, {
    signal: thunkAPI.signal
  })
  return reponse.data
})

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    const response = await http.put<Post>(`posts/${postId}`, body, {
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const deletePost = createAsyncThunk('blog/deletePost', async (postId: string, thunkAPI) => {
  const response = await http.delete<string>(`posts/${postId}`, {
    signal: thunkAPI.signal
  })
  return response.data
})

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    editPost: (state, action) => {
      const id = action.payload
      console.log('check id in edit post line 32: ', id)
      const foundPost = state.postList.find((post) => post.id === id) || null
      state.editingPost = foundPost
    },
    cancelEditingPost: (state) => {
      state.editingPost = null
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        console.log('check data inline 65: ', action.payload)
        state.postList = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        console.log('check post inline 78: ', action.payload)
        state.postList.push(action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.find((post, index) => {
          if (post.id === action.payload.id) {
            console.log('update post inline 85: ', action.payload)
            state.postList[index] = action.payload
            state.editingPost = null
            return true
          }
          state.editingPost = null
        })
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const idPost = action.meta.arg
        const deletePostIndex = state.postList.findIndex((post) => post.id === idPost)
        state.postList.splice(deletePostIndex, 1)
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

export const { editPost, cancelEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer
export default blogReducer
