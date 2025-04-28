import { createContext, useContext, useState } from "react";
import { products } from "../assets/assets";
import { IProduct, SizeOptions } from "../types";
import { toast } from "react-toastify";
import { type NavigateFunction, useNavigate } from "react-router-dom";

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
    addToCart: (productId: string, size: SizeOptions) => Promise<void>;
    getCartCount: () => number;
    updateQuantity: (itemId: string, size: SizeOptions, quantity: number) => Promise<void>;
    getCartAmount: () => number;
    navigate: NavigateFunction;
}


const ShopContext = createContext<IShopContext | null>(null);

const ShopContextProvider = ({ children }: { children: React.ReactNode }) => {
    const currency = '$'
    const delivery_fee = 10
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState<ICartItems>({});
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

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate
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
