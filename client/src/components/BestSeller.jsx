import React from 'react';
import ProductCart from './ProductCart';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();

  // Filter first 5 in-stock products
  const bestSellers = products.filter(product => product.inStock).slice(0, 5);

  return (
    <div className="mt-16 px-6 md:px-16 lg:px-24 xl:px-32">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
        {bestSellers.map((product, index) => (
          <ProductCart key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
