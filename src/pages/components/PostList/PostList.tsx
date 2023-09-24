import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deletePost, editPost } from 'pages/blogs/blog.slice'
import http from 'utils/http'

import PostItem from '../PostItem'
import { RootState } from 'store'

// Goi API trong useEffect()
// Neu goi thanh cong thi minh dispatch action type: "blog/getPostListSuccess"
// Neu goi that bai thi dispatch action type: "blog/getPostListFailed"

export default function PostList() {
  const dispatch = useDispatch()
  const postList = useSelector((state: RootState) => state.blog.postList)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    http
      .get('posts', {
        signal
      })
      .then((response) => {
        const postListResult = response.data
        console.log('check post List Result: ' + postListResult)
        dispatch({
          type: 'blog/getPostListSuccess',
          payload: postListResult
        })
      })
      .catch((error) => {
        if (error.code !== 'ERR_CANCELED') {
          dispatch({
            type: 'blog/getPostListFailed',
            payload: error.message
          })
        }
      })
    return () => {
      controller.abort()
    }
  }, [dispatch])

  console.log('check post list data: ', postList)

  const handleDeletePost = (id: string) => {
    dispatch(deletePost(id))
    console.log('delete post with id: ' + id)
  }
  const handleEditPost = (id: string) => {
    dispatch(editPost(id))
    console.log('edit post with id: ' + id)
  }
  return (
    <div>
      <div className='bg-white py-6 sm:py-8 lg:py-12'>
        <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
          <div className='mb-10 md:mb-16'>
            <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>Blogs List</h2>
            <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
              Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
            </p>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
            {postList.map((post, index) => {
              return (
                <PostItem
                  key={`post-item-${index}`}
                  post={post}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
