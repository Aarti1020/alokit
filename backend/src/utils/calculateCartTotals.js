const calculateCartTotals = (cartItems = [], products = []) => {
  const freeShippingThreshold = 2999;
  const standardShippingCharge = 199;
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const items = cartItems.map((item) => {
    const product = productMap.get((item.productId || item.product).toString());
    const snapshotUnitPrice = Number(item.unitPrice || 0);
    const unitPrice =
      snapshotUnitPrice > 0 ? snapshotUnitPrice : Number(product.basePrice || 0);
    const finalPrice =
      snapshotUnitPrice > 0
        ? snapshotUnitPrice
        : Number(product.salePrice) > 0
          ? Number(product.salePrice)
          : unitPrice;
    const quantity = Number(item.quantity);
    const lineTotal = finalPrice * quantity;

    return {
      itemId: item._id,
      product: product._id,
      productId: item.productId || product._id,
      name: item.productName || product.title || product.name,
      slug: item.productSlug || product.slug,
      sku: product.sku,
      thumbnail: item.featuredImage || product.featuredImage || product.thumbnail,
      productType: product.productType,
      quantity,
      stock: product.stock,
      unitPrice,
      finalPrice,
      lineTotal,
      category: product.category,
      subCategory: product.subCategory,
      selectedVariant: item.selectedVariant || null,
      productName: item.productName || product.title || product.name,
      productSlug: item.productSlug || product.slug,
      featuredImage: item.featuredImage || product.featuredImage || product.thumbnail
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const discount = 0;
  const shippingCharge = subtotal > 0 && subtotal < freeShippingThreshold ? standardShippingCharge : 0;
  const tax = 0;
  const total = subtotal - discount + shippingCharge + tax;

  return {
    items,
    pricing: {
      subtotal,
      discount,
      shippingCharge,
      tax,
      total
    }
  };
};

export default calculateCartTotals;
