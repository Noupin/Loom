import { useSetRecoilState } from "recoil";
import { logoState } from "../State";
import { useEffect, useRef, useState } from "react";
import { TLogo } from "../types/TLogo";
import Progress from "../component/Progress";
import { useAnimateColor } from "../hook/animateColor";
import { TScrollDirection } from "../types/TScrollDirection";
import { SparklesCore } from "../component/Sparkles";
import { Vortex } from "../component/Vortex";
import { AuroraBackground } from "../component/Aurora";
import { STORIES } from "../Stories";

interface IEffectTransition {
  startTransition: number;
  endTransition: number;
  effect: JSX.Element;
}

// const baseSkinColor = "#7b5644";
const greenEyeColor = "#757752";
const redEyeColor = "#991b1b";
const storyPartRenderWindow = 2;

const storyParts = [
  "My skin is shredded from the recent encounter with a vampire I've been tracking. He managed to escape, but next time he won't be so lucky.",
  "Next time, I will dust that bloodsucker.",
  "I open the door to our home just in time to see Claire crushing sleeping pills and mixing them in a glass of water. Part of the routine—she always knows just what I need to recover.",
  "My heart belongs to the hunt, but I do love Claire. Yet it seems every time I lay eyes on her, she has less hair than before. The cancer is holding us both captive, tightening its grip on her.",
  "I drop my crossbow, and Claire's eyes widen as she surveys my injuries. She quickly brings the glass of water to the table.",
  'Claire gasps, fully taking in my condition. "Oh, my love."',
  'I look into her beautiful green eyes as her hands tremble. Her voice cracks. "You need to rest." She forces a small smile. "How\'s the other guy?"',
  'The lacerations all over my body burn, though I can\'t help but smirk, straightening up and exhaling sharply through my nose. "His escape was but a temporary reprieve; his end is inevitable."',
  "Claire's fingers trace the cuts on my body with all the care in the world. She picks up a rag, dips it in alcohol, then begins to blot the wounds on my abdomen and bicep.",
  "She lingers around the places she most enjoys, even if they aren't touched by blood. Just how she always does when tending to my wounds, and I don't mind one bit.",
  "It's a small comfort, letting our minds wander and forgetting everything for a moment. After cleaning the wounds, she sews my skin, adding to the collection of scars strewn across my body, given to me by those beasts.",
  'After minutes of contemplation Claire finally breaks the silence. "How long can you keep this up?"',
  'I wince as I reach to cup Claire\'s face. "I have to keep going until I kill every last one of them. I\'ll hunt them till my final breath." I bring my hands back,  my right knee starts to bounce, and I grin, "I did hit him though. No one else can claim such an achievement. He knows our next meeting will seal his fate."',
  "Claire drops the alcohol rag, her eyes welling with tears. \"I... I can't keep doing this. I don't know how much more time I have. Can't you... Won't you... take a break?\" She pauses, then says softly, \"For me?\"",
  'I don\'t want to meet her beautiful green eyes, now rimmed in red I\'m sure, but I force myself to. "I can\'t stop, Claire, not while a single vampire remains." I let out a breath, quickly changing the subject, "How was the therapy?"',
  'Claire scoffs. "Oh, I am almost done. Can\'t you tell from my hair?"',
  'She reaches to take off my gauntlet, but I pull my arm away. "I have to keep the armor on. I need to be ready when I wake, just in case."',
  "I grab a vial of shimmering purple serum from the table and inject myself.",
  "My veins pulse with a faint glow before the light slowly fades. I am stilled, wishing the magic that helps me could heal her.",
  '"I wish I could be there with you, Claire."',
  'She sighs, preparing to echo familiar words we\'ve exchanged countless times. "But you can be with me, my love. There will always be more to hunt."',
  'Once again, I respond with the answer I know she does now want to hear. "Hopefully not for long," I wink and as I pick up the water. Claire flinches.',
  '"He is a vampire, and you have cancer. Maybe his remains will help me understand decay. This is how I can save you, and we can spend time together. No vampires for me, no cancer for you, just us." I bring the glass to my lips.',
  'Claire lunges, words tumbling out. "It\'s been sitting for too long. Let me make it again."',
  'She prepares a new glass of water. I hear her crush a pill, mix the water, and bring it over to me. I take the glass of water from her and say, "One pill. The sooner I will return to you." I drink the mixture. It tastes sweeter than usual. I smile at Claire. "Would you dim the lights please?"',
  "Claire moves to turn off the lights, and as I drift into a land of recurring nightmares, I hear rustling and a soft creak.",
  "My last thought is a fleeting curiosity about the tint of the drink before sleep finally overtakes me.",
  "My eyes snap open, red light bleeding through the cracks in the shutters.",
  "The burning of the lacerations that previously riddled my body is no longer noticeable. I have been asleep much longer than anticipated.",
  "I know I have lost time in the hunt for him. I stand up, grab my crossbow, and head towards the abandoned castle I tracked him to earlier.",
  "As I approach the castle, the fog pooling on the ground is tinged green from the grass, and the sky is an ominous tapestry of red, yellow, and black from the setting sun.",
  "The castle is imposing, with long shadows growing softer as the sunset turns to twilight. Echoes are amplified now, from the rustle of mice to the cry of hawks, though one distinctly sounds like a hiss.",
  "I carefully check around a corner and see two figures at the end of a long hallway, moonlight shining through the window, spotlighting a woman from whom a cloaked figure is feeding. Instinct takes over, as I fire a bolt into the figure's side before I can think. As the figure turns, I recognize him instantly.",
  "Blood leaks from his neck where the bolt struck true. He brings the woman's face close to his chest and gently lowers her to the ground.",
  "The moonlight now illuminates a pale bite mark on her neck, rimmed in the deep red of blood.",
  "I know what I have to do. I am not a monster; this is the job. Turning each and every one to ash.",
  "I am merciless.",
  "I am silent.",
  "I am professional.",
  "I take in a deep breath through my nose. First he dies, then I will put her out of the misery of becoming a vampire.",
  "The shot is easy to line up and the trigger yields to my finger's pressure. A bolt flies straight through where his cold heart is. He shrieks in pain.",
  'I slowly approach him as he says, "You never were a romantic, were you?"',
  '"What I am doesn\'t matter. What matters is there\'s one less bloodsucker out there," knowing this is the last time he will hear his name makes this moment even sweeter, "Dracula".',
  '"Well, I figured there was a reason why she came to me for help. But now I know why,"',
  "Dracula says as he dissipates into a dark dune of dust.",
  "I snap my head to the woman. To the hands that have put me together so many times. Claire is rustling, and I know what must be done. I press the crossbow to her heart, puncturing the skin, but no blood comes forth from beneath her snow white skin.",
  "Claire knocks me back with a strength far surpassing my expectations, sending my crossbow flying.",
  'She moves closer, her fangs growing as she speaks. "Be with me."',
  'I flinch, "Not like this."',
  'Claire wipes a tear from her eye. "I just wanted more time with you, my love."',
  'I crawl backward, searching for my crossbow. "You know, every night, I will hunt you."',
  'She cocks her head to the side. "I look forward to finally being your love,"',
  '"Till your last breath."',
  "I see my crossbow a few feet away. As she looms over me, her eyes dart back and forth.",
  'They transition from that beautiful green that I loved, to a red as deep as the blood she will endlessly hunger for. "You\'re already there. Grab it," she says.',
  'I lace my fingers around the hilt of the crossbow. She says, "What would you do without me?" I point the crossbow at her heart—at the vampire\'s heart.',
  'She spins with astonishing speed, moving toward the window. Her silhouette is framed as she grows wings. She tests them and says "I will love you forever." With a powerful flap, the vampire takes flight, crashing through the window.',
  "The End.",
];

export default function MyXTheVampireSlayer() {
  const setLogoType = useSetRecoilState(logoState);
  const scrollDirection = useRef(TScrollDirection.Down);
  const scrollDirectionChanged = useRef(false);
  const [storyPart, setStoryPart] = useState(0);

  const bgTransitionIndex = useRef(0);
  const bgTransitions = [
    { index: 0, color: "#7f1d1d" },
    { index: 2, color: "#422006" },
    { index: 17, color: "#1e293b" },
    { index: 26, color: "#030712" },
    { index: 27, color: "#991b1b" },
    { index: 28, color: "#431407" },
    { index: 29, color: "#1c1917" },
    { index: 32, color: "#292524" },
    { index: 44, color: "#450a0a" },
    { index: 46, color: "#0c0a09" },
    { index: 56, color: "#0c0a09" },
    { index: 57, color: "#4b5563" },
  ];
  const bgTransitionIndexes = bgTransitions.map(
    (transition) => transition.index
  );

  const [bgColor, setBgColor] = useState(bgTransitions[0].color);
  const [colorFrom, setColorFrom] = useState(bgTransitions[0].color);
  const [colorTo, setColorTo] = useState(bgTransitions[1].color);
  const [animateColorProgress, setAnimateColorProgress] = useState(0);

  const AnimationTiming = {
    fadeTextIn: 500,
    fadeTextOut: 200,
    translateTextIn: 300,
    translateTextOut: 200,
    purpleVortexFade: 1500,
    bgColorTransition: 1000,
    auroraFade: 1000,
    eyeTransition: 1000,
    dustFade: 1000,
    greenEyeFade: 1000,
    changingEyesFade: 1000,
  };

  const effectTransitions: IEffectTransition[] = [
    {
      startTransition: 6,
      endTransition: 6,
      effect: (
        <div className="absolute z-[-1] top-0 left-0 w-full h-full">
          {storyPart >= 5 && storyPart <= 7 && (
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl z-[1]" />
          )}
          <div
            className="flex w-full h-full justify-center items-center flex-col transition-opacity"
            style={{
              opacity: storyPart === 6 ? 1 : 0,
              transitionDuration: `${AnimationTiming.greenEyeFade}ms`,
            }}
          >
            <div className="flex-[1]" />
            <div className="flex flex-row ">
              <div
                className="w-14 h-10 rounded-full mr-5"
                style={{
                  backgroundColor: greenEyeColor,
                }}
              />
              <div
                className="w-14 h-10 rounded-full ml-5"
                style={{
                  backgroundColor: greenEyeColor,
                }}
              />
            </div>
            <div className="flex-[2]" />
          </div>
        </div>
      ),
    },
    {
      startTransition: 17,
      endTransition: 18,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity
        flex w-full h-full justify-center items-center"
          style={{
            transitionDuration: `${AnimationTiming.purpleVortexFade}ms`,
            opacity: storyPart >= 17 && storyPart <= 18 ? 1 : 0,
          }}
        >
          <Vortex
            rangeY={800}
            particleCount={500}
            baseHue={273}
            rangeHue={25}
            opacity={(20 - storyPart) / (19 - 17)}
            backgroundColor="transparent"
          />
        </div>
      ),
    },
    {
      startTransition: 27,
      endTransition: 28,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity
        flex w-full h-full justify-center items-center"
          style={{
            transitionDuration: `${AnimationTiming.auroraFade}ms`,
            opacity: storyPart >= 27 && storyPart <= 28 ? 1 : 0,
          }}
        >
          <AuroraBackground
            className="h-full w-full"
            style={{
              backgroundColor: bgColor,
              transitionDuration: `${AnimationTiming.bgColorTransition}ms`,
            }}
          />
        </div>
      ),
    },
    {
      startTransition: 30,
      endTransition: 31,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity
        flex w-full h-full justify-center items-center"
          style={{
            transitionDuration: `${AnimationTiming.bgColorTransition}ms`,
            opacity: storyPart >= 30 && storyPart <= 31 ? 1 : 0,
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60" />
          <img
            src={
              STORIES.filter(
                (item) => item.link === "/my-x-the-vampire-slayer"
              )[0].image
            }
            alt="Cover photo"
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      startTransition: 30,
      endTransition: 31,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity
        flex w-full h-full justify-center items-center"
          style={{
            transitionDuration: `${AnimationTiming.bgColorTransition}ms`,
            opacity: storyPart >= 30 && storyPart <= 31 ? 1 : 0,
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60" />
          <img
            src={
              STORIES.filter(
                (item) => item.link === "/my-x-the-vampire-slayer"
              )[0].image
            }
            alt="Cover photo"
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      startTransition: 44,
      endTransition: 44,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity flex w-full
          h-full justify-center items-center"
          style={{
            opacity: storyPart === 44 ? 1 : 0,
            transitionDuration: `${AnimationTiming.dustFade}ms`,
          }}
        >
          <SparklesCore
            background="transparent"
            minSize={0.3}
            maxSize={2}
            particleDensity={500}
            className="w-full h-full"
            particleColor="#1c1917"
          />
        </div>
      ),
    },
    {
      startTransition: 53,
      endTransition: 54,
      effect: (
        <div className="absolute z-[-1] top-0 left-0 w-full h-full">
          {storyPart >= 52 && storyPart <= 55 && (
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl z-[1]" />
          )}
          <div
            className="flex w-full h-full justify-center items-center flex-col transition-opacity"
            style={{
              opacity: storyPart >= 53 && storyPart <= 54 ? 1 : 0,
            }}
          >
            <div className="flex-[1]" />
            <div className="flex flex-row w-full">
              <div className="flex-[2]" />
              <div
                className="flex flex-row"
                style={{
                  transform: "rotateY(35deg)",
                }}
              >
                <div
                  className="w-16 h-10 rounded-full mr-5 transition-colors"
                  style={{
                    backgroundColor:
                      storyPart <= 53 ? greenEyeColor : redEyeColor,
                    transitionDuration: `${AnimationTiming.eyeTransition}ms`,
                  }}
                />
                <div
                  className="w-16 h-10 rounded-full ml-5 transition-colors"
                  style={{
                    backgroundColor:
                      storyPart <= 53 ? greenEyeColor : redEyeColor,
                    transitionDuration: `${AnimationTiming.eyeTransition}ms`,
                  }}
                />
              </div>
              <div className="flex-[1]" />
            </div>
            <div className="flex-[2]" />
          </div>
        </div>
      ),
    },
  ];

  const handleWheel = (event: WheelEvent) => {
    if (event.deltaY > 0) {
      scroll(TScrollDirection.Down);
    } else {
      scroll(TScrollDirection.Up);
    }
  };

  const arrowKeyPressed = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      scroll(TScrollDirection.Down);
    } else if (event.key === "ArrowUp") {
      scroll(TScrollDirection.Up);
    }
  };

  const scroll = (direction: TScrollDirection) => {
    if (scrollDirectionChanged) {
      scrollDirectionChanged.current = false;
    }

    if (direction === TScrollDirection.Down) {
      if (scrollDirection.current === TScrollDirection.Up) {
        scrollDirectionChanged.current = true;
      }
      scrollDirection.current = TScrollDirection.Down;
      setStoryPart((current) => Math.min(current + 1, storyParts.length - 1));
    } else {
      if (scrollDirection.current === TScrollDirection.Down) {
        scrollDirectionChanged.current = true;
      }
      scrollDirection.current = TScrollDirection.Up;
      setStoryPart((current) => Math.max(current - 1, 0));
    }
  };

  useEffect(() => {
    if (
      bgTransitionIndexes.includes(storyPart) &&
      storyPart != 0 &&
      scrollDirection.current === TScrollDirection.Down &&
      bgTransitionIndex.current + 2 < bgTransitions.length
    ) {
      bgTransitionIndex.current++;
      setColorFrom(bgTransitions[bgTransitionIndex.current].color);
      setColorTo(bgTransitions[bgTransitionIndex.current + 1].color);
    } else if (
      bgTransitionIndexes.includes(storyPart) &&
      storyPart != bgTransitionIndexes[bgTransitionIndexes.length - 1] &&
      scrollDirection.current === TScrollDirection.Up &&
      bgTransitionIndex.current > 0
    ) {
      bgTransitionIndex.current--;
      setColorFrom(bgTransitions[bgTransitionIndex.current].color);
      setColorTo(bgTransitions[bgTransitionIndex.current + 1].color);
    } else if (scrollDirectionChanged.current) {
      if (
        scrollDirection.current === TScrollDirection.Up &&
        bgTransitionIndex.current > 0 &&
        storyPart < bgTransitionIndexes[bgTransitionIndex.current]
      ) {
        setColorFrom(bgTransitions[bgTransitionIndex.current - 1].color);
        setColorTo(bgTransitions[bgTransitionIndex.current].color);
        bgTransitionIndex.current--;
      }
      if (
        scrollDirection.current === TScrollDirection.Down &&
        bgTransitionIndex.current + 2 < bgTransitions.length &&
        storyPart > bgTransitionIndexes[bgTransitionIndex.current + 1]
      ) {
        setColorFrom(bgTransitions[bgTransitionIndex.current + 1].color);
        setColorTo(bgTransitions[bgTransitionIndex.current + 2].color);
        bgTransitionIndex.current++;
      }
    }

    setAnimateColorProgress(
      Math.min(
        (storyPart - bgTransitionIndexes[bgTransitionIndex.current]) /
          (bgTransitionIndexes[bgTransitionIndex.current + 1] -
            bgTransitionIndexes[bgTransitionIndex.current]),
        1
      )
    );
  }, [storyPart]);

  useEffect(() => {
    setLogoType(TLogo.LightLogo);
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("keydown", arrowKeyPressed);
    // window.addEventListener("touchstart", handleTouchStart);
    // window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", arrowKeyPressed);
      // window.removeEventListener("touchstart", handleTouchStart);
      // window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // useEffect(() => {
  //   console.log(storyPart);
  // }, [storyPart]);

  useEffect(() => {
    console.log(bgColor);
  }, [bgColor]);

  useAnimateColor(
    colorFrom,
    colorTo,
    setBgColor,
    false,
    0,
    animateColorProgress
  );

  return (
    <main
      className="h-full w-full flex flex-row font-cormorant text-off justify-center
      items-center px-2 relative z-[-2] transition-[background-color]"
      style={{
        backgroundColor: bgColor,
        transitionDuration: `${AnimationTiming.bgColorTransition}ms`,
      }}
    >
      <div />

      <div className="flex-1 flex flex-row h-full">
        {storyParts.map((part, index) => {
          if (Math.abs(index - storyPart) <= storyPartRenderWindow) {
            return (
              <div
                key={index}
                className="absolute left-0 right-0 top-0 px-12 h-full flex items-center
                justify-center transition-opacity overflow-hidden"
                style={{
                  zIndex: storyPart === index ? 1 : 0,
                  opacity: index === storyPart ? 1 : 0,
                  transitionDuration:
                    index === storyPart
                      ? `${AnimationTiming.fadeTextIn}ms`
                      : `${AnimationTiming.fadeTextOut}ms`,
                }}
              >
                <p
                  className="text-lg lg:text-3xl text-center"
                  style={{
                    transitionDuration:
                      index === storyPart
                        ? `${AnimationTiming.translateTextIn}ms`
                        : `${AnimationTiming.translateTextOut}ms`,
                    transform: `translateY(${
                      index === storyPart ? 0 : storyPart < index ? 100 : -100
                    }px)`,
                  }}
                >
                  {part}
                </p>
              </div>
            );
          }
        })}

        {effectTransitions.map((transition) => {
          if (
            storyPart >= transition.startTransition - storyPartRenderWindow &&
            storyPart <= transition.endTransition + storyPartRenderWindow
          ) {
            return transition.effect;
          }
        })}
      </div>

      <div>
        <Progress current={storyPart} max={storyParts.length - 1} />
      </div>
    </main>
  );
}
