const assert = require('node:assert/strict');
const { afterEach, describe, it } = require('node:test');
const { getDemoProducts } = require('./productController');
const productController = require('./productController');
const Product = require('../models/Product');

const originalEstimatedDocumentCount = Product.estimatedDocumentCount;
const originalFindOne = Product.findOne;

afterEach(() => {
  Product.estimatedDocumentCount = originalEstimatedDocumentCount;
  Product.findOne = originalFindOne;
});

describe('demo product API catalog', () => {
  it('returns all demo products with explicitly marked demo IDs', () => {
    const products = getDemoProducts({ sort: 'newest' });

    assert.equal(products.length, 14);
    assert.ok(products.every((product) => product.isDemo));
    assert.ok(products.every((product) => product._id.startsWith('demo-')));
  });

  it('applies API filters, ordering, and pagination to demo results', () => {
    const products = getDemoProducts({
      category: 'women',
      color: 'rose',
      size: 'M',
      q: 'summer',
      sort: 'price_desc',
    });

    assert.equal(products.length, 1);
    assert.equal(products[0].slug, 'floral-midi-summer-dress');
  });

  it('returns matching sale products for deals and preserves data fields', () => {
    const deals = getDemoProducts({ sort: 'newest' }).filter(
      (product) => product.dealOfMonth,
    );

    assert.equal(deals.length, 4);
    assert.ok(deals.every((product) => product.originalPrice > product.price));
  });

  it('serves demo products through the paginated API when the database is empty', async () => {
    Product.estimatedDocumentCount = async () => 0;
    let response;
    const req = { query: { category: 'WOMEN', page: '2', limit: '2' } };
    const res = { json: (body) => { response = body; } };

    await productController.getProducts(req, res, (error) => {
      throw error;
    });

    assert.equal(response.pagination.total, 5);
    assert.equal(response.products.length, 2);
    assert.ok(response.products.every((product) => product.isDemo));
  });

  it('serves a demo product detail by slug when the database is empty', async () => {
    Product.findOne = async () => null;
    Product.estimatedDocumentCount = async () => 0;
    let response;
    const req = { params: { slugOrId: 'classic-indigo-denim-jacket' } };
    const res = { json: (body) => { response = body; } };

    await productController.getProductBySlugOrId(req, res, (error) => {
      throw error;
    });

    assert.equal(response.product.slug, 'classic-indigo-denim-jacket');
    assert.equal(response.product.isDemo, true);
  });
});
