import { createReducer } from "@reduxjs/toolkit";
import { Post } from '../../types/blog.type'


interface BlogState {
  postList: Post[]
}

const intialState: BlogState = {
  postList: []
}
const blogReducer  = createReducer(intialState, builder => {

})


export default blogReducer;