import { createContext, useContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { IProduct, SizeOptions } from "../types";
import { toast } from "react-toastify";

interface IShopContext {
    products: IProduct[];
    currency: string;
    delivery_fee: number;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    showSearch: boolean;
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
    cartItem: ICartItem;
    addToCart: (productId: string, size: SizeOptions) => Promise<void>;
    getCartCount: () => number;
}

type ICartItem = Record<string, Partial<Record<SizeOptions, number>>>;

const ShopContext = createContext<IShopContext | null>(null);

const ShopContextProvider = ({ children }: { children: React.ReactNode }) => {
    const currency = '$'
    const delivery_fee = 10
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItem, setCartItem] = useState<ICartItem>({});

    const addToCart = async (productId: string, size: SizeOptions) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        const cartData = structuredClone(cartItem);

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
        setCartItem(cartData);
    }

    const getCartCount = () => {
        let count = 0;
        for (const key in cartItem) {
            if (cartItem[key]) {
                for (const size in cartItem[key]) {
                    count += cartItem[key][size as SizeOptions] || 0;
                }
            }
        }
        return count;
    }

    useEffect(() => {
        console.log(cartItem);
    }, [cartItem])

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItem,
        addToCart,
        getCartCount
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
