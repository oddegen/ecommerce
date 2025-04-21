import About from "./About";
import Cart from "./Cart";
import Collections from "./Collections";
import Contact from "./Contact";
import Home from "./Home";
import Login from "./Login";
import Orders from "./Orders";
import PlaceOrder from "./PlaceOrder";
import Product from "./Product";

export const pages = [
  {
    path: "/",
    element: Home,
  },
  {
    path: "/collection",
    element: Collections,
  },
  {
    path: "/about",
    element: About,
  },
  {
    path: "/contact",
    element: Contact,
  },
  {
    path: "/product/:productId",
    element: Product,
  },
  {
    path: "/cart",
    element: Cart,
  },
  {
    path: "/login",
    element: Login,
  },
  {
    path: "/place-order",
    element: PlaceOrder,
  },
  {
    path: "/orders",
    element: Orders,
  },
];
