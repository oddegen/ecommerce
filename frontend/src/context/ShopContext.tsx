import { createContext, useContext, useEffect, useState } from "react";
import { IProduct, SizeOptions } from "../types";
import { toast } from "react-toastify";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import axios from "axios";

type ICartItems = Record<string, Partial<Record<SizeOptions, number>>>;

interface IShopContext {
    products: IProduct[];
    currency: string;
    delivery_fee: number;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    showSearch: boolean;
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
    cartItems: ICartItems;
    setCartItems: React.Dispatch<React.SetStateAction<ICartItems>>;
    addToCart: (productId: string, size: SizeOptions) => Promise<void>;
    getCartCount: () => number;
    updateQuantity: (itemId: string, size: SizeOptions, quantity: number) => Promise<void>;
    getCartAmount: () => number;
    navigate: NavigateFunction;
    backendUrl: string;
    token?: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
}


const ShopContext = createContext<IShopContext | null>(null);

const ShopContextProvider = ({ children }: { children: React.ReactNode }) => {
    const currency = '$'
    const delivery_fee = 10
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState<ICartItems>({});
    const [products, setProducts] = useState<IProduct[]>([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (productId: string, size: SizeOptions) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        const cartData = structuredClone(cartItems);

        if (cartData[productId]) {
            if (cartData[productId][size]) {
                cartData[productId][size] += 1;
            }
            else {
                cartData[productId][size] = 1;
            }
        } else {
            cartData[productId] = {
                [size]: 1
            }
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart', { itemId: productId, size }, {
                    headers: {
                        token
                    }
                })
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }
    }

    const getCartCount = () => {
        let count = 0;
        for (const key in cartItems) {
            if (cartItems[key]) {
                for (const size in cartItems[key]) {
                    count += cartItems[key][size as SizeOptions] || 0;
                }
            }
        }
        return count;
    }

    const updateQuantity = async (itemId: string, size: SizeOptions, quantity: number) => {
        const cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        if (token) {
            try {
                await axios.put(backendUrl + '/api/cart', { itemId, size, quantity }, {
                    headers: {
                        token
                    }
                })
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const items in cartItems) {
            if (cartItems[items]) {
                const itemInfo = products.find((product) => product._id === items);

                if (itemInfo) {
                    for (const size in cartItems[items]) {
                        try {
                            if ((cartItems[items][size as SizeOptions] ?? 0) > 0) {
                                totalAmount += (itemInfo.price * (cartItems[items][size as SizeOptions]!));
                            }
                        } catch (error) {
                            console.error("Error calculating cart amount:", error);
                        }
                    }
                }
            }
        }

        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/products')
            if (response.data.success === true) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.get(backendUrl + '/api/cart', {
                headers: {
                    token
                }
            })

            if (response.data.success === true) {
                setCartItems(response.data.cartData);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData();
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token') || '');
            getUserCart(localStorage.getItem('token'))
        }
    }, [])

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken
    }

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useShopContext = () => {
    const shopContext = useContext(ShopContext);

    if (!shopContext) {
        throw new Error(
            "useShopContext has to be used within ShopContextProvider"
        )
    }

    return shopContext;
}

export default ShopContextProvider
