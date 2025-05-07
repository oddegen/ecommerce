import { useState } from "react"
import { assets } from "../assets/assets"
import CartTotal from "../components/CartTotal"
import Title from "../components/Title"
import { useShopContext } from "../context/ShopContext"
import { toast } from "react-toastify"

const PlaceOrder = () => {

    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useShopContext();
    const [method, setMethod] = useState('cod');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.name
        const value = e.target.value

        setFormData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find((product) => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            switch (method) {
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/orders/place', orderData, { headers: { token } })
                    if (response.data.success === true) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;
                default:
                    break;

            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col md:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1="DELIVERY" text2="INFORMATION" />
                </div>
                <div className="flex gap-3">
                    <input onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border rounded py-1.5 px-3.5 w-full" placeholder="First name" type="text" required />
                    <input onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border rounded py-1.5 px-3.5 w-full" placeholder="Last name" type="text" required />
                </div>
                <input onChange={onChangeHandler} name="email" value={formData.email} className="border rounded py-1.5 px-3.5 w-full" placeholder="Email address" type="email" required />
                <input onChange={onChangeHandler} name="street" value={formData.street} className="border rounded py-1.5 px-3.5 w-full" placeholder="Street" required />
                <div className="flex gap-3">
                    <input onChange={onChangeHandler} name="city" value={formData.city} className="border rounded py-1.5 px-3.5 w-full" placeholder="City" type="text" required />
                    <input onChange={onChangeHandler} name="state" value={formData.state} className="border rounded py-1.5 px-3.5 w-full" placeholder="State" type="text" required />
                </div>
                <div className="flex gap-3">
                    <input onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="border rounded py-1.5 px-3.5 w-full" placeholder="Zipcode" type="number" required />
                    <input onChange={onChangeHandler} name="country" value={formData.country} className="border rounded py-1.5 px-3.5 w-full" placeholder="Country" type="text" required />
                </div>
                <input onChange={onChangeHandler} name="phone" value={formData.phone} className="border rounded py-1.5 px-3.5 w-full" placeholder="Phone" type="number" required />
            </div>

            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>

                <div className="mt-12">
                    <Title text1="PAYMENT" text2="METHOD" />
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div className="flex items-center gap-3 border p-2 px-3 cursor-not-allowed">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-500' : ''}`}></p>
                            <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
                        </div>
                        <div className="flex items-center gap-3 border p-2 px-3 cursor-not-allowed">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-500' : ''}`}></p>
                            <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500' : ''}`}></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className="w-full text-end mt-8">
                        <button type="submit" className="bg-black text-white px-16 py-3 text-sm">PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
