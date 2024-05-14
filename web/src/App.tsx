//Third Party Imports
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

// First Party Imports
import logoForLight from "./assets/logoForLight.svg";

// Pages
import Landing from "./page/Landing";
import StoryTemplate from "./page/StoryTemplate";
import ExampleStory from "./page/ExampleStory";

export default function App() {
  return (
    <BrowserRouter>
      <Link to="/">
        <img
          src={logoForLight}
          alt="Logo"
          height={50}
          width={50}
          className="absolute top-[25px] left-[25px] cursor-pointer"
        />
      </Link>

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/TestStory"
          element={
            <StoryTemplate>
              <ExampleStory />
            </StoryTemplate>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
