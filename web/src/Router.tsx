import { createBrowserRouter } from "react-router-dom";
import Landing from "./page/Landing";
import Color from "./page/Color";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/:color",
    element: <Color />,
  },
]);
