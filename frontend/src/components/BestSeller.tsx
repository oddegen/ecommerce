import { useEffect, useState } from "react";
import { useShopContext } from "../context/ShopContext"
import Title from "./Title";
import ProductItem from "./ProductItem";
import { IProduct } from "../types";

const BestSeller = () => {
    const { products } = useShopContext();
    const [bestSellers, setBestSellers] = useState<IProduct[]>([]);

    useEffect(() => {
        const bestProducts = products.filter((product) => product.bestseller);
        setBestSellers(bestProducts.slice(0, 5));
    }, [products])

    return (
        <div className="my-10">
            <div className="text-center text-3xl py-8">
                <Title text1="BEST" text2="SELLER" />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {
                    bestSellers.map((product, idx) => (
                        <ProductItem key={idx} id={product._id} image={product.image} name={product.name} price={product.price} />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller
