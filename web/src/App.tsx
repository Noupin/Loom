//Third Party Imports
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

// Pages
import Landing from "./page/Landing";
import StoryTemplate from "./page/StoryTemplate";
import ExampleStory from "./page/ExampleStory";
import { useRecoilValue } from "recoil";
import { logoState } from "./State";
import { getLogo } from "./helper/chooseLogo";

export default function App() {
  const logoType = useRecoilValue(logoState);
  return (
    <BrowserRouter>
      <Link to="/">
        <img
          src={getLogo(logoType)}
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
