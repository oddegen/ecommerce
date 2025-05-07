import Add from "./Add";
import List from "./List";
import Orders from "./Order";

const pages = [
  {
    path: "/add",
    element: Add,
  },
  {
    path: "/list",
    element: List,
  },
  {
    path: "/orders",
    element: Orders,
  },
];

export default pages;
