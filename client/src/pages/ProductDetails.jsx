import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCart from "../components/ProductCart";

const ProductDetails = () => {
    const { products, navigate, currency, addToCart } = useAppContext();
    const { id } = useParams();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item) => item._id === id);

    useEffect(() => {
        if (products.length > 0 && product) {
            let productsCopy = products.filter(
                (item) => product.category === item.category && item._id !== product._id
            );
            setRelatedProducts(productsCopy.slice(0, 5));
        }
    }, [products, product]);

    useEffect(() => {
        setThumbnail(product?.image[0] || null);
    }, [product]);

    return product && (
        <div className="mt-12 px-4 md:px-8 max-w-screen-xl mx-auto">
            <p className="text-sm text-gray-600">
                <Link to="/" className="hover:text-indigo-500">Home</Link> /
                <Link to="/products" className="hover:text-indigo-500"> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-indigo-500"> {product.category}</Link> /
                <span className="text-indigo-600 font-medium"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-10 mt-8">
                {/* Product Images */}
                <div className="flex gap-4 flex-1">
                    <div className="flex flex-col gap-3 max-h-[400px] overflow-auto">
                        {product.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setThumbnail(image)}
                                className="border border-gray-300 rounded cursor-pointer overflow-hidden w-20 h-20"
                            >
                                <img src={image} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 border border-gray-300 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" className="object-cover w-full h-full max-h-[400px]" />
                    </div>
                </div>

                {/* Product Details */}
                <div className="w-full md:w-1/2">
                    <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>

                    <div className="flex items-center gap-1 mt-2">
                        {Array(5).fill('').map((_, i) => (
                            <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="star" className="w-4" />
                        ))}
                        <p className="ml-2 text-gray-600">(4)</p>
                    </div>

                    <div className="mt-6 space-y-1">
                        <p className="text-gray-400 line-through text-sm">MRP: {currency}{product.price}</p>
                        <p className="text-2xl font-semibold">MRP: {currency}{product.offerPrice}</p>
                        <span className="text-sm text-gray-500">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-lg font-medium mt-6 mb-2">About Product</p>
                    <ul className="list-disc ml-5 text-gray-600 space-y-1 text-sm">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                            onClick={() => addToCart(product._id)}
                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded transition"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => { addToCart(product._id); navigate("/cart"); }}
                            className="w-full py-3 bg-primary hover:bg-primary text-white font-medium rounded transition"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-20 text-center">
                <h2 className="text-2xl font-semibold">Related Products</h2>
                <div className="w-16 h-1 bg-primary mx-auto mt-1 rounded-full"></div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
                    {relatedProducts.filter(p => p.inStock).map((product, index) => (
                        <ProductCart key={index} product={product} />
                    ))}
                </div>

                <button
                    onClick={() => { navigate('/products'); scrollTo(0, 0); }}
                    className="mt-12 px-8 py-2 border border-primary text-primary rounded hover:bg-primary transition"
                >
                    See More
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
