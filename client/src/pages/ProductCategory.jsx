import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCart from '../components/ProductCart'; // ✅ Reuse same component

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category && product.inStock
  );

  return (
    <div className="mt-16 px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col">
      {searchCategory && (
        <div className="flex flex-col items-start w-full mb-6">
          <p className="text-2xl font-medium">{searchCategory.text.toUpperCase()}</p>
          <div className="w-16 h-0.5 bg-primary rounded-full mt-1"></div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCart key={index} product={product} />
          ))
        ) : (
          <p className='text-2xl font-medium text-primary'>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
