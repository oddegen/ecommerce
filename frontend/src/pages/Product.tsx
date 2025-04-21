import { useShopContext } from "../context/ShopContext";
import { useEffect, useState } from "react";
import { IProduct, SizeOptions } from "../types";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
    const { productId } = useParams();
    const { products, currency, addToCart } = useShopContext();
    const [productData, setProductData] = useState<IProduct | null>(null);
    const [image, setImage] = useState('');
    const [size, setSize] = useState<SizeOptions>('M')

    const fetchProductData = async () => {
        products.map((product) => {
            if (product._id === productId) {
                setProductData(product);
                setImage(product.image[0]);
                return null;
            }
        })
    }

    useEffect(() => {
        fetchProductData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId, products])

    return productData ? (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
            <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">

                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                        {
                            productData.image.map((img, idx) => (
                                <img onClick={() => setImage(img)} key={idx} src={img} className="w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer" alt="" />
                            ))
                        }
                    </div>
                    <div className="w-full sm:w-[80%]">
                        <img className="w-full h-auto" src={image} alt="" />
                    </div>
                </div>

                <div className="flex-1">
                    <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
                    <div className="flex items-center gap1 mt-2">
                        <img src={assets.star_icon} alt="" className="w-3.5" />
                        <img src={assets.star_icon} alt="" className="w-3.5" />
                        <img src={assets.star_icon} alt="" className="w-3.5" />
                        <img src={assets.star_icon} alt="" className="w-3.5" />
                        <img src={assets.star_dull_icon} alt="" className="w-3.5" />
                        <p className="pl-2">(122)</p>
                    </div>
                    <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
                    <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
                    <div className="flex flex-col gap-4 my-8">
                        <p>Select Size</p>
                        <div className="flex gap-2">
                            {productData.sizes.map((sz, idx) => (
                                <button onClick={() => setSize(sz)} className={`border border-gray-300 py-2 px-4 bg-gray-100 ${size === sz ? 'border-orange-300' : ''}`} key={idx}>{sz}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => addToCart(productData._id, size)} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">ADD TO CART</button>
                    <hr className="mt-8 sm:w-4/5 text-gray-300" />
                    <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                        <p>100% Original product.</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <div className="flex">
                    <p className="border border-gray-300 px-5 py-3 text-sm">Description</p>
                    <p className="border-y border-r border-gray-300 px-5 py-3 text-sm">Reviews (122)</p>
                </div>
                <div className="flex flex-col gap-4 border border-gray-300 px-6 py-6 text-sm text-gray-500 mt-1">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, a. Libero cum nulla consequuntur provident id pariatur omnis at aspernatur molestias, voluptatum eligendi quae neque quisquam tempore ipsam atque aut?
                        Aspernatur provident suscipit mollitia quisquam est vero expedita, repellendus libero ratione hic? Quod ab aliquam, debitis odio atque nihil laborum sunt recusandae, quo possimus deserunt rerum expedita animi corporis voluptas!
                    </p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et est aut tempora ad voluptatem eos accusamus incidunt a quae ullam deserunt voluptas eligendi ipsam voluptate repellat optio, molestias provident. Laboriosam.</p>
                </div>
            </div>

            <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>
    ) : (
        <div className="opacity-0"></div>
    )
}

export default Product
