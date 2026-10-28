import demoProductData from '../data/demoProducts.json' with { type: 'json' };

export const DEMO_PRODUCTS = demoProductData.map((product) => ({
  ...product,
  _id: `demo-${product.slug}`,
  isDemo: true,
}));

export function getDemoProduct(slug) {
  return DEMO_PRODUCTS.find((product) => product.slug === slug) || null;
}

export function getDemoCatalog({
  page = 1,
  limit = 9,
  sort = 'newest',
  size = '',
  color = '',
  category = '',
  tag = '',
  q = '',
} = {}) {
  const normalizedQuery = q.trim().toLowerCase();
  let products = DEMO_PRODUCTS.filter((product) => {
    if (size && !product.sizes.includes(size)) return false;
    if (
      color &&
      !product.colors.some((item) => item.name.toLowerCase() === color.toLowerCase())
    ) {
      return false;
    }
    if (category && product.category !== category.toUpperCase()) return false;
    if (tag && !product.tags.includes(tag.toLowerCase())) return false;
    if (
      normalizedQuery &&
      ![product.title, product.description, ...product.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    ) {
      return false;
    }
    return true;
  });

  if (sort === 'price_asc') products = products.toSorted((a, b) => a.price - b.price);
  if (sort === 'price_desc') products = products.toSorted((a, b) => b.price - a.price);
  if (sort === 'rating') products = products.toSorted((a, b) => b.rating - a.rating);
  if (sort === 'newest') products.reverse();

  const start = (Math.max(1, page) - 1) * limit;
  return {
    products: products.slice(start, start + limit),
    total: products.length,
  };
}
