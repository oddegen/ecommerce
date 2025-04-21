import { useEffect, useState } from "react"
import { useShopContext } from "../context/ShopContext"
import { Categories, IProduct, SubCategories } from "../types"
import Title from "./Title"
import ProductItem from "./ProductItem"

interface IRelatedProductsProps {
    category: Categories;
    subCategory: SubCategories;
}

const RelatedProducts = ({ category, subCategory }: IRelatedProductsProps) => {
    const { products } = useShopContext()
    const [related, setRelated] = useState<IProduct[]>([])

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice()

            productsCopy = productsCopy.filter((product) => product.category === category && product.subCategory === subCategory)
            setRelated(productsCopy.slice(0, 5))
        }
    }, [category, products, subCategory])

    return (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <Title text1="RELATED" text2="PRODUCTS" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {
                    related.map((relatedProduct, idx) => (
                        <ProductItem key={idx} id={relatedProduct._id} name={relatedProduct.name} image={relatedProduct.image} price={relatedProduct.price} />
                    ))
                }
            </div>
        </div>
    )
}

export default RelatedProducts
