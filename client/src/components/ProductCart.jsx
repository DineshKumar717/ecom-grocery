import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCart = ({ product }) => {
  const navigate = useNavigate();
  const { currency, addToCart, removeFromCart, cartItems } = useAppContext();

  if (!product) return null;

  const handleNavigate = () => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    scrollTo(0, 0);
  };

  return (
    <div
      onClick={handleNavigate}
      className="border border-gray-300 rounded-md md:px-4 px-3 py-2 bg-white w-full max-w-56 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center justify-center">
        <img
          className="hover:scale-105 transition-transform duration-200 w-full h-32 object-contain"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p>{product.category}</p>
        <p className="text-gray-800 font-semibold text-base truncate">{product.name}</p>

        <div className="flex items-center gap-1 mt-1">
          {Array(5)
            .fill('')
            .map((_, i) => (
              <img
                key={i}
                className="w-3.5"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="star"
              />
            ))}
          <p className="text-xs">(4)</p>
        </div>

        <div className="flex items-end justify-between mt-3">
          <p className="text-primary font-semibold text-base md:text-lg">
            {currency}
            {product.offerPrice}
            <span className="text-gray-400 line-through ml-2 text-sm">
              {currency}
              {product.price}
            </span>
          </p>

          <div onClick={(e) => e.stopPropagation()} className="text-primary">
            {!cartItems[product._id] ? (
              <button
                className="flex items-center gap-1 bg-primary/10 border border-primary/40 md:w-20 w-16 h-[34px] rounded text-primary text-sm justify-center"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.cart_icon} alt="cart" className="w-4 h-4" />
                Add
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-primary/25 md:w-20 w-16 h-[34px] rounded text-sm justify-center">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="px-2"
                >
                  -
                </button>
                <span>{cartItems[product._id]}</span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="px-2"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
