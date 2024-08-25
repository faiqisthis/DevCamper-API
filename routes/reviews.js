import express from 'express'
import {protect,authorize, authorizeOwnership} from '../middleware/auth.js'
import{getReviews, updateReview,deleteReview,createReview, getReview} from '../controllers/reviews.js'
import getAdvancedResults from '../middleware/advancedResults.js'
import Review from '../models/Reviews.js'
const router =express.Router({mergeParams:true})


router.get('/',getAdvancedResults(Review,{
    path:'bootcamp',
    select:'name description'
}),getReviews)
router.get('/:id',getReview)
router.put('/:id',protect,authorize('admin','user'),authorizeOwnership('Review'),updateReview)
router.delete('/:id',protect,authorize('admin','user'),authorizeOwnership('Review'),deleteReview)
router.post('/',protect,authorize('admin','user'),createReview)

export default router
