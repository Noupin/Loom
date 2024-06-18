import { useSetRecoilState } from "recoil";
import { logoState } from "../State";
import { useEffect, useState } from "react";
import { TLogo } from "../types/TLogo";
import { useAnimateColor } from "../hook/animateColor";
import { StickyScroll } from "../component/StickyScrollReveal";
import { TypewriterEffect } from "../component/TypeWriterEffect";

const content = [
  {
    title: "Collaborative Editing",
    description:
      "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Collaborative Editing
      </div>
    ),
  },
  {
    title: "Real time changes",
    description:
      "See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <img
          src="https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fb38a219-28f9-467d-b1e5-e51c650cbdd4/width=1792,quality=90/00670-2667752565.jpeg"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Version control",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Version control
      </div>
    ),
  },
  {
    title: "Running out of content",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Running out of content
      </div>
    ),
  },
];

const words = [
  {
    text: "Vampire",
  },
  {
    text: "hunters",
  },
  {
    text: "coming",
  },
  {
    text: "soon",
  },
  {
    text: "...",
    className: "text-red-600 dark:text-red-600",
  },
];

export default function MyXTheVampireSlayer() {
  const setLogoType = useSetRecoilState(logoState);

  useEffect(() => {
    setLogoType(TLogo.LightLogo);
  }, []);

  return (
    <main className="flex flex-col w-full h-full transition-colors text-white bg-off-500">
      <div className="flex-1"></div>
      <div className="flex-[7] bg-white bg-opacity-5 rounded-lg m-5 px-5 py-4">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <TypewriterEffect
            words={words}
            className="text-off"
            cursorClassName="bg-red-600"
          />
        </div>
      </div>
      <div className="flex-1"></div>
    </main>
  );
}
