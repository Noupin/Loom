import { useSetRecoilState } from "recoil";
import { logoState } from "../State";
import { useEffect, useRef, useState } from "react";
import { TLogo } from "../types/TLogo";
import Progress from "../component/Progress";
import { useAnimateColor } from "../hook/animateColor";
import { TScrollDirection } from "../types/TScrollDirection";
import { SparklesCore } from "../component/Sparkles";
import { Vortex } from "../component/Vortex";
import { blendColors } from "../helper/color";

interface IEffectTransition {
  startTransition: number;
  endTransition: number;
  effect: JSX.Element;
}

interface IStoryPart {
  text: string;
  effect?: JSX.Element;
}

const storyParts = [
  "My skin is shredded from the recent encounter with a vampire I've been tracking. He managed to escape, but next time he won't be so lucky.",
  "Next time, I will dust that bloodsucker.",
  //Fade in a yellow lamp
  "I open the door to our home just in time to see Claire crushing sleeping pills and mixing them in a glass of water. Part of the routine—she always knows just what I need to recover.",
  "My heart belongs to the hunt, but I do love Claire. Yet it seems every time I lay eyes on her, she has less hair than before. The cancer is holding us both captive, tightening its grip on her.",
  // Fade in more lamps
  "I drop my crossbow, and Claire's eyes widen as she surveys my injuries. She quickly brings the glass of water to the table.",
  'Claire gasps, fully taking in my condition. "Oh, my love."',
  'I look into her beautiful green eyes as her hands tremble. Her voice cracks. "You need to rest." She forces a small smile. "How\'s the other guy?"',
  'The lacerations all over my body burn, though I can\'t help but smirk, straightening up and exhaling sharply through my nose. "His escape was but a temporary reprieve; his end is inevitable."',
  "Claire's fingers trace the cuts on my body with all the care in the world. She picks up a rag, dips it in alcohol, then begins to blot the wounds on my abdomen and bicep.",
  "She lingers around the places she most enjoys, even if they aren't touched by blood. Just how she always does when tending to my wounds, and I don't mind one bit.",
  "It's a small comfort, letting our minds wander and forgetting everything for a moment. After cleaning the wounds, she sews my skin, adding to the collection of scars strewn across my body, given to me by those beasts.",
  'After minutes of contemplation Claire finally breaks the silence. "How long can you keep this up?"',
  'I wince as I reach to cup Claire\'s face. "I have to keep going until I kill every last one of them. I\'ll hunt them till my final breath." I bring my hands back,  my right knee starts to bounce, and I grin, "I did hit him though. No one else can claim such an achievement. He knows our next meeting will seal his fate."',
  // Some text effect
  // Fade in text
  "Claire drops the alcohol rag, her eyes welling with tears. \"I... I can't keep doing this. I don't know how much more time I have. Can't you... Won't you... take a break?\" She pauses, then says softly, \"For me?\"",
  'I don\'t want to meet her beautiful green eyes, now rimmed in red I\'m sure, but I force myself to. "I can\'t stop, Claire, not while a single vampire remains." I let out a breath, quickly changing the subject, "How was the therapy?"',
  'Claire scoffs. "Oh, I am almost done. Can\'t you tell from my hair?"',
  'She reaches to take off my gauntlet, but I pull my arm away. "I have to keep the armor on. I need to be ready when I wake, just in case."',
  // Fade in vortex and purple rounded rectangle
  "I grab a vial of shimmering purple serum from the table and inject myself.",
  // Pulse word \"pulse\" blue-500
  "My veins pulse with a faint glow before the light slowly fades. I am stilled, wishing the magic that helps me could heal her.",
  // Slow pulse and fade to regular text color
  '"I wish I could be there with you, Claire."',
  'She sighs, preparing to echo familiar words we\'ve exchanged countless times. "But you can be with me, my love. There will always be more to hunt."',
  'Once again, I respond with the answer I know she does now want to hear. "Hopefully not for long," I wink and as I pick up the water. Claire flinches.',
  '"He is a vampire, and you have cancer. Maybe his remains will help me understand decay. This is how I can save you, and we can spend time together. No vampires for me, no cancer for you, just us." I bring the glass to my lips.',
  'Claire lunges, words tumbling out. "It\'s been sitting for too long. Let me make it again."',
  // Swirl white sparkles
  'She prepares a new glass of water. I hear her crush a pill, mix the water, and bring it over to me. I take the glass of water from her and say, "One pill. The sooner I will return to you." I drink the mixture. It tastes sweeter than usual. I smile at Claire. "Would you dim the lights please?"',
  "Claire moves to turn off the lights, and as I drift into a land of recurring nightmares, I hear rustling and a soft creak.",
  "My last thought is a fleeting curiosity about the tint of the drink before sleep finally overtakes me.",
  // Quickly transition to red aurora effect
  "My eyes snap open, red light bleeding through the cracks in the shutters.",
  "The burning of the lacerations that previously riddled my body is no longer noticeable. I have been asleep much longer than anticipated.",
  "I know I have lost time in the hunt for him. I stand up, grab my crossbow, and head towards the abandoned castle I tracked him to earlier.",
  // Unblur the background to reveal the cover image
  "As I approach the castle, the fog pooling on the ground is tinged green from the grass, and the sky is an ominous tapestry of red, yellow, and black from the setting sun.",
  // Start blurring the background
  "The castle is imposing, with long shadows growing softer as the sunset turns to twilight. Echoes are amplified now, from the rustle of mice to the cry of hawks, though one distinctly sounds like a hiss.",
  // Bring in the spotlight & lamp
  "I carefully check around a corner and see two figures at the end of a long hallway, moonlight shining through the window, spotlighting a woman from whom a cloaked figure is feeding. Instinct takes over, as I fire a bolt into the figure's side before I can think. As the figure turns, I recognize him instantly.",
  "Blood leaks from his neck where the bolt struck true. He brings the woman's face close to his chest and gently lowers her to the ground.",
  // Fade in two red dots in the spotlight
  "The moonlight now illuminates a pale bite mark on her neck, rimmed in the deep red of blood.",
  // Fade red dots & spotlight out
  "I know what I have to do. I am not a monster; this is the job. Turning each and every one to ash.",
  // Flip through last word in \"I am ___\"
  "I am merciless. I am silent. I am professional.",
  "I take in a deep breath through my nose. First he dies, then I will put her out of the misery of becoming a vampire.",
  // Fade to dark red background
  "The shot is easy to line up and the trigger yields to my finger's pressure. A bolt flies straight through where his cold heart is. He shrieks in pain.",
  'I slowly approach him as he says, "You never were a romantic, were you?"',
  '"What I am doesn\'t matter. What matters is there\'s one less bloodsucker out there," knowing this is the last time he will hear his name makes this moment even sweeter, "Dracula".',
  '"Well, I figured there was a reason why she came to me for help. But now I know why,"',
  // Fade in grayscale sparkles
  "Dracula says as he dissipates into a dark dune of dust.",
  // Fade spotlight back in
  "I snap my head to the woman. To the hands that have put me together so many times. Claire is rustling, and I know what must be done. I press the crossbow to her heart, puncturing the skin, but no blood comes forth from beneath her snow white skin.",
  // Fade spotlight out
  "Claire knocks me back with a strength far surpassing my expectations, sending my crossbow flying.",
  'She moves closer, her fangs growing as she speaks. "Be with me."',
  'I flinch, "Not like this."',
  'Claire wipes a tear from her eye. "I just wanted more time with you, my love."',
  'I crawl backward, searching for my crossbow. "You know, every night, I will hunt you."',
  // Highlight callback text
  'She cocks her head to the side. "I look forward to finally being your love. Till your last breath."',
  // Fade in green ovals behind layered behind frosted glass
  "I see my crossbow a few feet away. As she looms over me, her eyes dart back and forth.",
  // Transition eyes from green to red
  'They transition from that beautiful green that I loved, to a red as deep as the blood she will endlessly hunger for. "You\'re already there. Grab it," she says.',
  'I lace my fingers around the hilt of the crossbow. She says, "What would you do without me?" I point the crossbow at her heart—at the vampire\'s heart.',
  // Fade in lamp
  'She spins with astonishing speed, moving toward the window. Her silhouette is framed as she grows wings. She tests them and says "I will love you forever." With a powerful flap, the vampire takes flight, crashing through the window.',
  // Scale lamp up
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
    { index: 5, color: "#450a0a" },
    { index: 17, color: "#3b0764" },
    // { index: 8, color: "#7c2d12" },
    // { index: 13, color: "#111827" },
    // { index: 27, color: "#030712" },
    // { index: 28, color: "#000000" },
    // { index: 30, color: "#9a3412" },
    // { index: 40, color: "#450a0a" },
    // { index: 42, color: "#030712" },
    // { index: 49, color: "#450a0a" },
    // { index: 54, color: "#0f172a" },
    // { index: 55, color: "#030712" },
    // { index: 65, color: "#292524" },
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
    purpleVortexFade: 1000,
  };

  const effectTransitions: IEffectTransition[] = [
    {
      startTransition: 1,
      endTransition: 1,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity duration-100 flex w-full h-full justify-center items-center"
          style={{
            opacity: storyPart === 1 ? 1 : 0,
          }}
        >
          <SparklesCore
            background="transparent"
            minSize={0.3}
            maxSize={1}
            particleDensity={125}
            className="w-full h-full"
            particleColor="#57534e"
          />
        </div>
      ),
    },
    {
      startTransition: 17,
      endTransition: 20,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity
        flex w-full h-full justify-center items-center"
          style={{
            transitionDuration: `${AnimationTiming.purpleVortexFade}ms`,
            opacity: storyPart >= 17 && storyPart <= 19 ? 1 : 0,
          }}
        >
          <Vortex
            rangeY={800}
            particleCount={500}
            baseHue={273}
            opacity={(20 - storyPart) / (20 - 17)}
            backgroundColor="transparent"
          />
        </div>
      ),
    },
  ];

  const handleWheel = (event: WheelEvent) => {
    if (scrollDirectionChanged) {
      scrollDirectionChanged.current = false;
    }

    if (event.deltaY > 0) {
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
    // window.addEventListener("touchstart", handleTouchStart);
    // window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      // window.removeEventListener("touchstart", handleTouchStart);
      // window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    console.log((19 - storyPart) / (19 - 17));
  }, [storyPart]);

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
      className="h-full w-full flex flex-row font-cormorant text-off justify-center items-center px-2 relative z-[-2]"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div />

      <div className="flex-1 flex flex-row h-full">
        {storyParts.map((part, index) => (
          <div
            key={index}
            className="absolute left-0 right-0 top-0 px-12 h-full flex items-center justify-center transition-opacity overflow-hidden"
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
        ))}

        {effectTransitions.map((transition) => transition.effect)}
      </div>

      <div>
        <Progress current={storyPart} max={storyParts.length - 1} />
      </div>
    </main>
  );
}
