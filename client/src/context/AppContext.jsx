import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loadingUser, setLoadingUser] = useState(true);
  const [cartItemsState, setCartItemsState] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : {};
  });

  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  const setCartItems = (items) => {
    setCartItemsState(items);
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  const fetchUser = async () => {
  try {
    const { data } = await axios.get("/api/user/is-auth");
    if (data.success) {
      setUser(data.user);

      const localCart = JSON.parse(localStorage.getItem("cartItems")) || {};
      const backendCart = data.user.cartItems || {};
      const mergedCart = { ...backendCart, ...localCart }; // Prioritize local items

      setCartItems(mergedCart);
    }
  } catch (error) {
    console.log("User auth error:", error.message);
  } finally {
    setLoadingUser(false);
  }
};


  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItemsState);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    const cartData = structuredClone(cartItemsState);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  const removeFromCart = (itemId) => {
    const cartData = structuredClone(cartItemsState);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) delete cartData[itemId];
    }
    setCartItems(cartData);
    toast.success("Removed from Cart");
  };

  const getCartCount = () => {
    return Object.values(cartItemsState).reduce((acc, curr) => acc + curr, 0);
  };

  const getCartAmount = () => {
    return Math.floor(
      Object.entries(cartItemsState).reduce((total, [id, qty]) => {
        const item = products.find((p) => p._id === id);
        return item ? total + item.offerPrice * qty : total;
      }, 0) * 100
    ) / 100;
  };

  // On app mount
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // Sync cart to backend if user is logged in
 useEffect(() => {
  // ✅ Always save to localStorage
  localStorage.setItem("cartItems", JSON.stringify(cartItemsState));

  // ✅ Sync with backend if user is logged in
  const updateCart = async () => {
    try {
      const { data } = await axios.post("/api/cart/update", {
        cartItems: cartItemsState,
      });
      if (!data.success) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (user) {
    updateCart();
  }
}, [cartItemsState]);


  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems: cartItemsState,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
