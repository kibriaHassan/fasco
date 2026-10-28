const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/deals/month', productController.getDealOfMonth);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/', productController.getProducts);
router.get('/:slugOrId', productController.getProductBySlugOrId);

module.exports = router;
