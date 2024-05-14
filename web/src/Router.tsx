import { createBrowserRouter } from "react-router-dom";
import Landing from "./page/Landing";
import StoryTemplate from "./page/StoryTemplate";
import ExampleStory from "./page/ExampleStory";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/TestStory",
    element: (
      <StoryTemplate>
        <ExampleStory />
      </StoryTemplate>
    ),
  },
]);
