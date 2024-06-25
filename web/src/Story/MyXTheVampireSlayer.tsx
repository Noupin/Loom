import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { autoScrollState, logoState, wpmState } from "../State";
import { Fragment, useEffect, useRef, useState } from "react";
import { TLogo } from "../types/TLogo";
import { useAnimateColor } from "../hook/animateColor";
import { TScrollDirection } from "../types/TScrollDirection";
import { ParticleSystem } from "../component/Particles";
import { AuroraBackground } from "../component/Aurora";
import { STORIES } from "../Stories";
import { wpmToMs } from "../helper/animation";
import { GlassShatter } from "../component/GlassShatter";
import { useSearchParams } from "react-router-dom";
import { CircularProgress } from "../component/CircularProgress";
import { Config } from "../Config";

interface IEffectTransition {
  startTransition: number;
  endTransition: number;
  effect: JSX.Element;
}

const storyPartRenderWindow = 2;

const storyParts: JSX.Element[] = [
  <span>
    My skin is shredded after a recent encounter with the vampire I’ve been
    tracking. He managed to escape. I should have known better than to
    underestimate him, given his reputation. But next time, I won’t. Next time,
    I am going to turn that bloodsucker to dust.
  </span>,
  <span>
    I open the door to our home just in time to see Claire crushing sleeping
    pills and mixing them in a glass of water. Part of our routine—she always
    knows just what I need to recover.
  </span>,
  <span>
    My dedication to Claire and my work have finally come together, and I can
    use what I love to save the one who I love. Yet it seems every time I am
    lucky enough to lay eyes on Claire, she has less hair than before. The
    cancer is holding us both captive, tightening its grip on her, and one day
    soon she won’t be able to breathe.
  </span>,
  <span>
    I drop my crossbow, and her eyes widen as she surveys my injuries. She
    quickly brings the glass of water to the table. Finally having fully taken
    in my condition she gasps. “Oh, my love.”
  </span>,
  <span>
    I look into her beautiful green eyes as her hands tremble. Her voice cracks.
    “You need to rest.” She forces a small smile. “How’s the other guy?”
  </span>,
  <span>
    I can still feel the lacerations searing across my body, though I can’t help
    but smirk, straightening up and exhaling sharply through my nose. “His
    escape was but a temporary reprieve; his end is inevitable.”
  </span>,
  <span>
    Her fingers trace the cuts on my body with all the care in the world. She
    picks up a rag, dips it in alcohol, then begins to blot the wounds on my
    abdomen and bicep.
  </span>,
  <span>
    She lingers around the places she most enjoys, just how she always does when
    tending to my wounds, and I don’t mind one bit. It’s a small comfort,
    letting our minds wander and being able to forget everything for a moment.
    After cleaning the wounds, she sews my skin, adding to the collection of
    scars strewn across my body, given to me by years of the hunt.
  </span>,
  <span>
    After minutes of contemplation Claire finally breaks the silence. “How long
    can you keep this up?”
  </span>,
  <span>
    I wince as I reach to cup her face. “I have to keep going until I kill every
    last one of them. I’ll hunt them{" "}
    <span className="italic">till my final breath</span>.” I bring my hands
    back, my right knee starts to bounce, and I grin, “I did hit him though. No
    one else can claim such an achievement. He knows our next meeting will seal
    his fate.”
  </span>,
  <span>
    She drops the alcohol rag, her eyes welling with tears. “I… I can’t keep
    doing this. I don't know how much more time I have. Can’t you… Won’t you…
    take a break?” She pauses, then says softly, “For me?”
  </span>,
  <span>
    I don’t want to meet those eyes I love, now rimmed in red from crying I’m
    sure, but I force myself to. “I can’t stop, Claire, not while a single one
    of them remains.” I let out a breath, quickly changing the subject, “How was
    the therapy?”
  </span>,
  <span>She scoffs. “Oh, I am almost done. Can’t you tell from my hair?”</span>,
  <span>
    She reaches to take off my gauntlet, but I pull my arm away. “I have to keep
    the armor on. I need to be ready when I wake, just in case.”
  </span>,
  <span>
    I pick up a vial of shimmering purple serum off the table and inject myself.
    My veins <span className="animate-pulse text-purple-300">pulse</span> with a
    faint glow that gradually fades away. I am stilled, wishing the magic that
    helps me could heal her. “I wish I could be there with you, Claire.”
  </span>,
  <span>
    She sighs, preparing to echo words we’ve exchanged countless times. “But you
    can be with me, my love. There will always be more to hunt.”
  </span>,
  <span>
    Once again, I respond with the answer I know she does not want to hear.
    “Hopefully not for long,” I say with a wink. As I pick up the water, she
    shifts.
  </span>,
  <span>
    “Maybe we can study him and find a cure. This is how I can save you, and we
    can spend time together. No vampires for me, no cancer for you, just us.” I
    bring the glass to my lips.
  </span>,
  <span>
    She lunges towards me, words tumbling out. “It’s been sitting for too long.
    L-let me make it again.”
  </span>,
  <span>
    She prepares a new glass of water. I hear her crush a pill, mix the water,
    and bring it over to me. I take the glass of water from her and say, “One
    pill. The sooner I will return to you.” I drink the mixture. I smile at her.
    “Would you dim the lights please?”
  </span>,
  <span>
    She moves to turn off the lights as I drift into a land of recurring
    nightmares. I hear rustling and the soft creak of our door. My last thought
    is a fleeting curiosity about the tint of the drink before I am plunged into
    that dark land.
  </span>,
  <span>
    My eyes snap open. The setting sun already bleeds through cracks in the
    shutters. The burning of the lacerations that riddle my body has eased. I
    have been asleep much longer than anticipated. I know I have lost time in
    the hunt for him. I stand up, grab my crossbow, and head towards the
    abandoned castle I tracked him to earlier.
  </span>,
  <span>
    Fog rolls across the ground, and nature seems to still the closer I get to
    his lair. The trees are barren, and it seems life has abandoned the
    unstable, rocky terrain.
  </span>,
  <span>
    As I approach the castle, the fog pooled on the ground is tinged green by
    the remaining patches of grass. An ominous tapestry of crimson, amber, and
    onyx fills the sky in the last moments preceding nightfall. The castle
    looms, with long shadows growing softer. Echoes are amplified now, from the
    tiniest squeak of a mouse to the call of a feeding crow. Yet one distinctly
    sounds like a hiss.
  </span>,
  <span>
    I carefully check around a corner and see two figures at the end of a long
    hallway. Moonlight shines through the window, spotlighting a woman from whom
    a cloaked figure is feeding.
  </span>,
  <span>
    Instinct takes over, and I fire a bolt into the figure's side before I can
    think. As the figure turns, I recognize him instantly. Blood leaks from his
    neck where the bolt struck true. He brings the woman's face close to his
    chest and gently lowers her to the floor. A bite mark on her pale neck,
    bathed in twilight’s gaze, pools with deep scarlet blood.
  </span>,
  <span>
    I know what I have to do; this is the job. I am merciless. I am silent. I am
    efficient. I take in a deep breath through my nose. First, he dies. Then I
    will put her out of the misery of becoming a vampire.
  </span>,
  <span>
    The shot is easy to line up and the trigger yields to my finger’s pressure.
    The bolt is on a path straight through where his cold heart is. Mere inches
    away from him releasing a cry of pain, the vampire turns, sees the bolt, and
    sweeps towards me, hand outstretched.
  </span>,
  <span>
    Before I can register the movement, his claws are inches from my throat. I
    plant my back foot, lean forward, and push off into a sprint breaking open
    the wound on my abdomen and gaining three new slashes along the back of my
    neck. The continuation of our last encounter is born anew. This time there
    is no option to let him get away. I need him dead so I can find a cure for
    Claire. So we can finally have more time together.
  </span>,
  <span>
    Reloading my crossbow will take too long and my only other weapon is a
    wooden stake. I know once I get close to him, I won’t be able to withdraw
    with my life. The stake must pierce his heart.
  </span>,
  <span>
    I pull out a new crossbow bolt for a faux reload. Like a predator sensing
    weakness, he races towards me, taking the bait. I shift my stance bracing
    for the impact and stick the bolt in the path of his slashing hand. His
    shriek of pain rips through the air, acting as a warning to every creature
    in this castle.
  </span>,
  <span>
    A warm feeling catches my attention on the outside of my right thigh. Blood
    is seeping from where the claws on his other hand have impaled my leg. I
    slowly move my right hand to release the wooden stack from its sheath behind
    my back and wrap my left arm around his. He tries to pull away from me
    anticipating the blow, but I push us both to the ground, my arm arcing as we
    go down. His back meets the floor with resonant crack, I drive the stake
    directly into where I know his lifeless heart to be. Dracula is dead. He
    dissipates into a dark dune of dust.
  </span>,
  <span>
    Weary now from blood loss, I snap my head as quickly as I can to the woman.
    She is rustling, and I know what must be done. I rip the stake from
    Dracula’s heart, slowly rise holding the worst of my wounds, cobble over to
    her, and press the stake to her heart, puncturing the skin, but no blood
    comes forth from beneath her snow white pallor.
  </span>,
  <span>
    A wave of cold rolls over me from head to toe as I glance the woman's eyes
    and see a twinge of familiar green. I dart my gaze away, not wanting to
    believe. My eyes land on the woman's hands, the very same hands that have
    put me together so many times. I slowly raise my gaze, hoping to disprove
    what I now suspect. I feel the color being leached from my face to match
    that of the blanched skin that belongs to a rustling Claire.
  </span>,
  <span>
    She knocks me back with a strength far surpassing my expectations, sending
    my stake flying. She moves closer, her fangs growing as she speaks. “Be with
    me.”
  </span>,
  <span>I flinch, “Not like this.”</span>,
  <span>
    A tear silently streams down her face, which she quickly wipes away. “I just
    wanted more time with you, my love.”
  </span>,
  <span>I crawl backward, searching for my stake. “Claire. My love.”</span>,
  <span>
    She lets out a breath. “Finally.” Then she cocks her head to the right. “And
    now you can hunt me. <span className="italic">Till your final breath</span>
    .”
  </span>,
  <span>
    I see my stake a few feet away. As she looms over me, her eyes dart back and
    forth.
  </span>,
  <span>
    They transition from that beautiful green that I loved, to a red as deep as
    the blood she will endlessly hunger for. “You’re already there. Grab it,”
    she says.
  </span>,
  <span>
    I lace my fingers around the stake. She says, “What would you do without
    me?” She spins with astonishing speed, moving toward the window. Her
    silhouette is framed as she grows wings. She tests them and says “I will
    love you forever.” With a powerful flap, the vampire takes flight, crashing
    through the window.
  </span>,
  <span>The End</span>,
];

export default function MyXTheVampireSlayer() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setLogoType = useSetRecoilState(logoState);
  const [autoScroll, setAutoScroll] = useRecoilState(autoScrollState);
  const wpm = useRecoilValue(wpmState);
  const scrollDirection = useRef(TScrollDirection.Down);
  const scrollDirectionChanged = useRef(false);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchEndY = useRef(0);
  const touchEndX = useRef(0);
  const accumulatedTrackPadScroll = useRef(0);
  const [storyPart, setStoryPart] = useState(
    parseInt(searchParams.get("section") || "1") - 1
  );
  const usedManualScroll = useRef(false);
  const autoScrollTimeout = useRef<any>(null);

  const bgTransitionIndex = useRef(0);
  const bgTransitions = [
    { index: 0, color: "#450a0a" },
    { index: 3, color: "#422006" },
    { index: 14, color: "#1e293b" },
    { index: 20, color: "#030712" },
    { index: 21, color: "#b45309" },
    { index: 22, color: "#2D211D" },
    { index: 23, color: "#2D211D" },
    { index: 31, color: "#621414" },
    { index: 37, color: "#292524" },
    { index: 42, color: "#262626" },
  ];
  const bgTransitionIndexes = bgTransitions.map(
    (transition) => transition.index
  );

  const [bgColor, setBgColor] = useState(bgTransitions[0].color);
  const [colorFrom, setColorFrom] = useState(bgTransitions[0].color);
  const [colorTo, setColorTo] = useState(bgTransitions[1].color);
  const [animateColorProgress, setAnimateColorProgress] = useState(0);

  useAnimateColor(
    colorFrom,
    colorTo,
    setBgColor,
    false,
    0,
    animateColorProgress
  );

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
    glassFade: 500,
  };

  const effectTransitions: IEffectTransition[] = [
    {
      startTransition: 14,
      endTransition: 14,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity
        flex w-full h-full justify-center items-center"
          style={{
            transitionDuration: `${AnimationTiming.purpleVortexFade}ms`,
            opacity: storyPart === 14 ? 1 : 0,
          }}
        >
          <ParticleSystem
            rangeY={800}
            particleCount={500}
            baseHue={273}
            rangeHue={25}
            rangeSpeed={0.5}
            opacity={storyPart}
            backgroundColor="transparent"
            glow={true}
          />
        </div>
      ),
    },
    {
      startTransition: 21,
      endTransition: 21,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity
        flex w-full h-full justify-center items-center"
          style={{
            transitionDuration: `${AnimationTiming.auroraFade}ms`,
            opacity: storyPart === 21 ? 1 : 0,
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
      startTransition: 23,
      endTransition: 23,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity
        flex w-full h-full justify-center items-center"
          style={{
            transitionDuration: `${AnimationTiming.bgColorTransition}ms`,
            opacity: storyPart === 23 ? 1 : 0,
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30" />
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
      startTransition: 31,
      endTransition: 32,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity flex w-full
          h-full justify-center items-center"
          style={{
            opacity: storyPart >= 31 && storyPart <= 32 ? 1 : 0,
            transitionDuration: `${AnimationTiming.dustFade}ms`,
          }}
        >
          <ParticleSystem
            rangeY={1400}
            particleCount={75}
            baseRadius={4}
            rangeRadius={3}
            baseHue={178}
            baseTTL={1200}
            rangeTTL={800}
            baseSpeed={0.0175}
            rangeSpeed={0.01}
            rangeHue={0}
            saturation={13}
            lightness={7}
            opacity={storyPart}
            backgroundColor="transparent"
          />
        </div>
      ),
    },
    {
      startTransition: 42,
      endTransition: 42,
      effect: (
        <div
          className="absolute z-[-1] top-0 left-0 transition-opacity flex w-full
          h-full justify-center items-center"
          style={{
            opacity: storyPart === 42 ? 1 : 0,
            transitionDuration: `${AnimationTiming.glassFade}ms`,
          }}
        >
          <GlassShatter
            numPieces={25}
            minScale={0.6}
            maxScale={1}
            color="#e7e5e455"
            rotationRange={270}
            movementNoise={10}
            animationDuration={50}
            edgeNoise={2}
            seed={42}
          />
        </div>
      ),
    },
  ];

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (event.deltaMode === 1) {
      if (event.deltaY > Config.wheelEventThreshold) {
        manualScroll(TScrollDirection.Down);
      } else if (event.deltaY < -Config.wheelEventThreshold) {
        manualScroll(TScrollDirection.Up);
      }
    } else if (event.deltaMode === 0) {
      accumulatedTrackPadScroll.current += event.deltaY;
      // Handle trackpad
      if (accumulatedTrackPadScroll.current > Config.trackPadEventThreshold) {
        accumulatedTrackPadScroll.current = 0;
        manualScroll(TScrollDirection.Down);
      } else if (
        accumulatedTrackPadScroll.current < -Config.trackPadEventThreshold
      ) {
        accumulatedTrackPadScroll.current = 0;
        manualScroll(TScrollDirection.Up);
      }
    }
  };

  const arrowKeyPressed = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      manualScroll(TScrollDirection.Down);
    } else if (event.key === "ArrowUp") {
      manualScroll(TScrollDirection.Up);
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    touchEndY.current = event.touches[0].clientY;
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const touchDeltaY = touchStartY.current - touchEndY.current;
    const touchDeltaX = touchStartX.current - touchEndX.current;

    if (Math.abs(touchDeltaY) > Math.abs(touchDeltaX)) {
      if (touchDeltaY > Config.touchEventThreshold) {
        manualScroll(TScrollDirection.Down);
      } else if (touchDeltaY < -Config.touchEventThreshold) {
        manualScroll(TScrollDirection.Up);
      }
    }
  };

  const manualScroll = (direction: TScrollDirection) => {
    usedManualScroll.current = true;
    setAutoScroll(false);
    scroll(direction);
  };

  const scroll = (direction: TScrollDirection) => {
    if (isScrolling.current) return;

    isScrolling.current = true;
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

    isScrolling.current = false;
    usedManualScroll.current = false;
  };

  useEffect(() => {
    setLogoType(TLogo.LightLogo);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", arrowKeyPressed);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", arrowKeyPressed);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    // Find the correct initial transition index based on the storyPart
    const initialTransitionIndex = bgTransitionIndexes.findIndex(
      (index) => index >= storyPart
    );
    // Set initial colorFrom and colorTo based on the initial transition index
    if (initialTransitionIndex > 0) {
      setColorFrom(bgTransitions[initialTransitionIndex - 1].color);
      setColorTo(bgTransitions[initialTransitionIndex].color);
      bgTransitionIndex.current = initialTransitionIndex - 1;
    } else {
      setColorFrom(bgTransitions[0].color);
      setColorTo(bgTransitions[1].color);
      bgTransitionIndex.current = 0;
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

  const getAutoScrollDelay = () => {
    let childList = storyParts[storyPart].props.children;
    if (typeof childList === "string") {
      childList = [childList];
    }

    const children = childList.flatMap((child: string | JSX.Element) => {
      if (typeof child === "string") {
        return child.split(" ");
      } else if (typeof child === "object") {
        return child.props.children.split(" ");
      }
      return [];
    });

    return (
      AnimationTiming.fadeTextIn +
      AnimationTiming.translateTextIn +
      wpmToMs(wpm) * children.length
    );
  };

  useEffect(() => {
    if (!autoScroll || usedManualScroll.current) {
      if (autoScrollTimeout.current) clearTimeout(autoScrollTimeout.current);
      return;
    }

    autoScrollTimeout.current = setTimeout(() => {
      scroll(TScrollDirection.Down);
    }, getAutoScrollDelay());
  }, [storyPart, autoScroll]);

  useEffect(() => {
    if (storyPart <= 0) setStoryPart(0);
    if (storyPart >= storyParts.length - 1) setStoryPart(storyParts.length - 1);
    if (!storyPart) setStoryPart(0);

    setSearchParams({ section: (storyPart + 1).toString() });
  }, [storyPart, setSearchParams]);

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
                className="absolute left-0 right-0 top-0 px-16 h-full flex items-center
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
                  className="text-lg lg:text-3xl text-center relative z-10"
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

        {effectTransitions.map((transition, index) => {
          if (
            storyPart >= transition.startTransition - storyPartRenderWindow &&
            storyPart <= transition.endTransition + storyPartRenderWindow
          ) {
            return <Fragment key={index}>{transition.effect}</Fragment>;
          }
        })}
        <div className="absolute inset-0 z-0 backdrop-blur-sm mask-gradient" />
      </div>

      <div className="absolute h-full flex items-center right-2 md:right-4 z-10">
        <CircularProgress current={storyPart} max={storyParts.length} />
      </div>
    </main>
  );
}
