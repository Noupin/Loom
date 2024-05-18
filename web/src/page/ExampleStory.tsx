import { useSetRecoilState } from "recoil";
import { logoCustomColorState, logoState } from "../State";
import { useEffect, useState } from "react";
import { TLogo } from "../types/TLogo";
import { CardBody, CardContainer, CardItem } from "../component/3DCard";
import { useAnimateColor } from "../hook/animateColor";

export default function ExampleStory() {
  const setLogoType = useSetRecoilState(logoState);
  // const setLogoCustomColor = useSetRecoilState(logoCustomColorState);
  // const [bgColor, setBgColor] = useState("#E9ECF2");

  useEffect(() => {
    setLogoType(TLogo.LightLogo);
  }, []);

  // useAnimateColor("#E9ECF2", "#06070A", setLogoCustomColor, true, 0.1);
  // useAnimateColor("#06070A", "#E9ECF2", setBgColor, true, 0.1);

  return (
    <main className="flex flex-row w-full h-full bg-off-500 text-gray-200">
      <div className="flex-1"></div>
      <div className="flex-[7] bg-white bg-opacity-5 rounded-lg m-5 px-5 py-4">
        <div className="flex justify-between items-center w-full h-full">
          <div>I AM</div>
          <CardContainer className="inter-var" scale={0.25}>
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-gray-700/[0.1] dark:bg-black dark:border-white/[0.5] border-black/[0.5] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
              <CardItem
                translateZ="25"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                Make things float in air
              </CardItem>
              <CardItem
                as="p"
                translateZ="30"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Hover over this card to unleash the power of CSS perspective
              </CardItem>
              <CardItem translateZ="50" className="w-full mt-4">
                <img
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  height="1000"
                  width="1000"
                  className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </CardItem>
              <div className="flex justify-between items-center mt-20">
                <CardItem
                  translateZ={10}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  Try now →
                </CardItem>
                <CardItem
                  translateZ={10}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Sign up
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
          <div className="flex justify-end"> THE STORY</div>
        </div>
      </div>
      <div className="flex-1"></div>
    </main>
  );
}
