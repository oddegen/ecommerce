import { useEffect, useState } from "react";
import { useShopContext } from "../context/ShopContext"
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { Categories, IProduct, SortOptions, SubCategories } from "../types";

const Collections = () => {
    const { products, search, showSearch } = useShopContext();
    const [showFilter, setShowFilter] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<Categories[]>([]);
    const [subcategories, setSubcategories] = useState<SubCategories[]>([]);
    const [sortType, setSortType] = useState<SortOptions>('relevant');

    const toggleCategories = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (categories.includes(e.target.value as Categories)) {
            setCategories(prev => prev.filter(category => category !== e.target.value))
        } else {
            setCategories(prev => [...prev, e.target.value as Categories])
        }
    }

    const toggleSubCategories = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (subcategories.includes(e.target.value as SubCategories)) {
            setSubcategories(prev => prev.filter(subcategory => subcategory !== e.target.value))
        } else {
            setSubcategories(prev => [...prev, e.target.value as SubCategories])
        }
    }

    const applyFilters = () => {
        let productsCopy = products.slice();

        if (showSearch && search) {
            productsCopy = productsCopy.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))

        }

        if (categories.length > 0) {
            productsCopy = productsCopy.filter((product) => categories.includes(product.category))
        }

        if (subcategories.length > 0) {
            productsCopy = productsCopy.filter((product) => subcategories.includes(product.subCategory))
        }

        setFilteredProducts(productsCopy)
    }

    const sortProduct = () => {
        const filteredProductsCopy = filteredProducts.slice();

        switch (sortType) {
            case 'relevant':
                setFilteredProducts(filteredProductsCopy.filter((product) => product.bestseller))
                break;
            case 'low-high':
                setFilteredProducts(filteredProductsCopy.sort((a, b) => (a.price - b.price)))
                break;
            case 'high-low':
                setFilteredProducts(filteredProductsCopy.sort((a, b) => (b.price - a.price)))
                break;
            default:
                applyFilters();
                break;
        }
    }

    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories, subcategories, search, showSearch])

    useEffect(() => {
        sortProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortType])

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            <div className="min-w-60">
                <p onClick={() => setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">FILTERS
                    <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
                </p>

                <div className={`border pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <label className="flex gap-2 cursor-pointer">
                            <input className="w-3" type="checkbox" value={'Men'} onChange={toggleCategories} name="" id="men" /> Men
                        </label>
                        <label className="flex gap-2 cursor-pointer">
                            <input className="w-3" type="checkbox" value={'Women'} onChange={toggleCategories} name="" id="women" /> Women
                        </label>
                        <label className="flex gap-2 cursor-pointer">
                            <input className="w-3" type="checkbox" value={'Kids'} onChange={toggleCategories} name="" id="kids" /> Kids
                        </label>
                    </div>
                </div>

                <div className={`border pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 text-sm font-medium">TYPE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <label className="flex gap-2 cursor-pointer">
                            <input className="w-3" type="checkbox" value={'Topwear'} onChange={toggleSubCategories} name="" id="men" /> Topwear
                        </label>
                        <label className="flex gap-2 cursor-pointer">
                            <input className="w-3" type="checkbox" value={'Bottomwear'} onChange={toggleSubCategories} name="" id="women" /> Bottomwear
                        </label>
                        <label className="flex gap-2 cursor-pointer">
                            <input className="w-3" type="checkbox" value={'Winterwear'} onChange={toggleSubCategories} name="" id="kids" /> Winterwear
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1="ALL" text2="COLLECTIONS" />
                    <select className="border-2 text-sm px-2" onChange={(e) => setSortType(e.target.value as SortOptions)}>
                        <option value="relevant">Sort by: Relevant</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                    {
                        filteredProducts.map((product, idx) => (
                            <ProductItem key={idx} id={product._id} name={product.name} image={product.image} price={product.price} />
                        ))
                    }
                </div>
            </div>
        </div>

    )
}

export default Collections
