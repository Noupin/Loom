import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { RecoilRoot } from "recoil";
import logoForLight from "./assets/logoForLight.svg";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <>
        <React.StrictMode>
          <RecoilRoot>
            <>
              <img
                src={logoForLight}
                alt="Logo"
                height={50}
                width={50}
                className="absolute top-[25px] left-[25px]"
              />
              <RouterProvider router={router} />
            </>
          </RecoilRoot>
        </React.StrictMode>
        <RouterProvider router={router} />
      </>
    </RecoilRoot>
  </React.StrictMode>
);
