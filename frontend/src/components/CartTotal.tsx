import { useShopContext } from "../context/ShopContext"
import Title from "./Title";

const CartTotal = () => {

    const { currency, delivery_fee, getCartAmount } = useShopContext();
    return (
        <div className="w-full">
            <div className="text-2xl">
                <Title text1="CART" text2="TOTALS" />
            </div>

            <div className="flex flex-col gap-2 mt-2 text-sm">
                <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>{currency} {getCartAmount()}.00</p>
                </div>
                <hr />
                <div className="flex justify-between">
                    <p>Shipping Fee</p>
                    <p>{currency} {delivery_fee}.00</p>
                </div>
                <hr />
                <div className="flex justify-between">
                    <p className="font-medium">Total</p>
                    <p className="font-medium">{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
