import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  DEMO_PRODUCTS,
  getDemoCatalog,
  getDemoProduct,
} from './catalog.js';

const publicDirectory = fileURLToPath(new URL('../../public', import.meta.url));

describe('demo catalog', () => {
  it('contains the full seeded catalog with existing images and buyable variants', () => {
    assert.equal(DEMO_PRODUCTS.length, 14);
    for (const product of DEMO_PRODUCTS) {
      assert.ok(product.slug);
      assert.ok(product.images.length > 0);
      assert.ok(
        product.images.every((image) =>
          existsSync(path.join(publicDirectory, image.replace(/^\//, ''))),
        ),
        `${product.slug} references a missing local image`,
      );
      assert.ok(product.sizes.length > 0);
      assert.ok(product.colors.length > 0);
      assert.ok(product.stock > 0);
    }
  });

  it('finds products by slug', () => {
    assert.equal(
      getDemoProduct('classic-indigo-denim-jacket').title,
      'Classic Indigo Denim Jacket',
    );
    assert.equal(getDemoProduct('missing-product'), null);
  });

  it('filters and sorts demo products with pagination', () => {
    const result = getDemoCatalog({
      category: 'women',
      sort: 'price_asc',
      page: 1,
      limit: 2,
    });

    assert.equal(result.total, 5);
    assert.equal(result.products.length, 2);
    assert.ok(result.products[0].price <= result.products[1].price);
    assert.ok(result.products.every((product) => product.category === 'WOMEN'));
  });

  it('filters by search text, size, color, and tags', () => {
    const { products, total } = getDemoCatalog({
      q: 'denim',
      size: 'M',
      color: 'indigo',
      tag: 'bestseller',
    });

    assert.equal(total, 1);
    assert.equal(products[0].slug, 'classic-indigo-denim-jacket');
  });
});
