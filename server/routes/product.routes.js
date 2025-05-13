import express from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getProductsByFramework,
  searchProducts,
} from '../controllers/product.controller.js'
import { protect, admin } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route('/').get(getProducts).post(protect, admin, createProduct)

router.route('/featured').get(getFeaturedProducts)

router.route('/category/:category').get(getProductsByCategory)

router.route('/framework/:framework').get(getProductsByFramework)

router.route('/search').get(searchProducts)

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct)

export default router
