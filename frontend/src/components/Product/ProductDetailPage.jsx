import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import RelatedProducts from './RelatedProducts';
import ReviewsSection from './ReviewsSection';

const ProductDetailPage = () => {
  const { machineId } = useParams();  // ✅ URL param name match with route

  return (
    <div>
      <ProductDetails machineId={machineId} />
      <RelatedProducts machineId={machineId} />
      <ReviewsSection machineId={machineId} />
    </div>
  );
};

export default ProductDetailPage;
