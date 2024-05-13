import { createBrowserRouter } from "react-router-dom";
import Landing from "./page/Landing";
import Color from "./page/Color";
import StoryTemplate from "./page/StoryTemplate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/TestStory",
    element: <StoryTemplate />,
  },
  {
    path: "/:color",
    element: <Color />,
  },
]);
