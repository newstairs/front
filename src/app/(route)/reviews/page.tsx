import React, { Suspense } from 'react'
import PostReview from '@/app/_components/review/PostReview'

const PostReviewPage = () => {
  return (
    <Suspense>
      <PostReview /> 
    </Suspense>
  )
}

export default PostReviewPage