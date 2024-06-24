import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { autoScrollState, logoState, wpmState } from "../State";
import { useEffect, useRef, useState } from "react";
import { TLogo } from "../types/TLogo";
import { useAnimateColor } from "../hook/animateColor";
import { TScrollDirection } from "../types/TScrollDirection";
import { ParticleSystem } from "../component/Particles";
import { Vortex } from "../component/Vortex";
import { AuroraBackground } from "../component/Aurora";
import { STORIES } from "../Stories";
import { wpmToMs } from "../helper/animation";
import { GlassShatter } from "../component/GlassShatter";
import { useSearchParams } from "react-router-dom";
import { CircularProgress } from "../component/CircularProgress";

interface IEffectTransition {
  startTransition: number;
  endTransition: number;
  effect: JSX.Element;
}

const storyPartRenderWindow = 2;

const storyParts: JSX.Element[] = [
  <span>
    My skin is shredded from the recent encounter with a vampire I’ve been
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
    sure, but I force myself to. “I can’t stop, Claire, not while a single
    vampire remains.” I let out a breath, quickly changing the subject, “How was
    the therapy?”
  </span>,
  <span>She scoffs. “Oh, I am almost done. Can’t you tell from my hair?”</span>,
  <span>
    She reaches to take off my gauntlet, but I pull my arm away. “I have to keep
    the armor on. I need to be ready when I wake, just in case.”
  </span>,
  <span>
    I grab a vial of shimmering purple serum from the table and inject myself.
    My veins <span className="animate-pulse text-purple-300">pulse</span> with a
    faint glow before the light slowly fades. I am stilled, wishing the magic
    that helps me could heal her. “I wish I could be there with you, Claire.”
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
    “He is a vampire, and you have cancer. Maybe his remains will help me
    understand decay. This is how I can save you, and we can spend time
    together. No vampires for me, no cancer for you, just us.” I bring the glass
    to my lips.
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
    is a fleeting curiosity about the tint of the drink before sleep finally
    overtakes me.
  </span>,
  <span>
    My eyes snap open, red light from the sunset bleeding through the cracks in
    the shutters. The burning of the lacerations that previously riddled my body
    is no longer noticeable. I have been asleep much longer than anticipated. I
    know I have lost time in the hunt for him. I stand up, grab my crossbow, and
    head towards the abandoned castle I tracked him to earlier.
  </span>,
  <span>
    Fog is rolling across the ground and nature seems to have stilled the closer
    I get to his lair. Trees barren and life seemingly wanting to escape from
    the unstable rocky terrain.
  </span>,
  <span>
    As I approach the castle, the fog pooling on the ground is tinged green from
    the little grass there is. The sky is an ominous tapestry of red, yellow,
    and black from the setting sun. The castle is imposing, with long shadows
    growing softer as the sunset turns to twilight. Echoes are amplified now,
    from the rustle of mice to the cry of hawks, though one distinctly sounds
    like a hiss.
  </span>,
  <span>
    I carefully check around a corner and see two figures at the end of a long
    hallway. Moonlight shines through the window, spotlighting a woman from whom
    a cloaked figure is feeding.
  </span>,
  <span>
    Instinct takes over, as I fire a bolt into the figure's side before I can
    think. As the figure turns, I recognize him instantly. Blood leaks from his
    neck where the bolt struck true. He brings the woman's face close to his
    chest and gently lowers her to the floor. A pale bite mark on her neck,
    bathed in the twilights’ gaze, pooling in the deep red of blood.
  </span>,
  <span>
    I know what I have to do; this is the job. I am merciless. I am silent. I am
    professional. I take in a deep breath through my nose. First, he dies. Then
    I will put her out of the misery of becoming a vampire.
  </span>,
  <span>
    The shot is easy to line up and the trigger yields to my finger’s pressure.
    The bolt is on a path straight through where his cold heart is. Inches
    before he would release a cry of pain, the vampire turns, sees the bolt, and
    is swiftly on the other side of the room.
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
    I pull out a new crossbow bolt and fake a reload. He takes the bait and
    races towards me. I shift my stance bracing for the impact and stick the
    bolt in the path of his slashing hand. His shriek of pain rips through the
    air, acting as a warning to every creature in this castle.
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
    A wave of cold rolls over me from head to toe as I glance the womans eyes
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
    A tear silently streams down her face before she wipes it away. “I just
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
  const [storyPart, setStoryPart] = useState(
    parseInt(searchParams.get("section") || "1") - 1
  );
  const usedManualScroll = useRef(false);

  const bgTransitionIndex = useRef(0);
  const bgTransitions = [
    { index: 0, color: "#450a0a" },
    { index: 1, color: "#422006" },
    { index: 14, color: "#1e293b" },
    { index: 20, color: "#030712" },
    { index: 21, color: "#b45309" },
    { index: 22, color: "#450a0a" },
    { index: 23, color: "#1c1917" },
    { index: 28, color: "#450a0a" },
    { index: 31, color: "#450a0a" },
    { index: 37, color: "#44403c" },
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
    scrollDebounce: 50,
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
          <Vortex
            rangeY={800}
            particleCount={500}
            baseHue={273}
            rangeHue={25}
            opacity={(19 - storyPart) / (18 - 17)}
            backgroundColor="transparent"
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
            background="transparent"
            minSize={1}
            maxSize={4}
            particleDensity={75}
            className="w-full h-full"
            particleColor="#1c1917"
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
    if (event.deltaY > 0) {
      manualScroll(TScrollDirection.Down);
    } else {
      manualScroll(TScrollDirection.Up);
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
  };

  const handleTouchMove = (event: TouchEvent) => {
    const touchEndY = event.touches[0].clientY;
    const touchDeltaY = touchStartY.current - touchEndY;
    if (touchDeltaY > 0) {
      manualScroll(TScrollDirection.Down);
    } else {
      manualScroll(TScrollDirection.Up);
    }
  };

  const manualScroll = (direction: TScrollDirection) => {
    usedManualScroll.current = true;
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

    setTimeout(() => {
      isScrolling.current = false;
      usedManualScroll.current = false;
    }, AnimationTiming.scrollDebounce);
  };

  useEffect(() => {
    setLogoType(TLogo.LightLogo);
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("keydown", arrowKeyPressed);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", arrowKeyPressed);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
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

    if (
      bgTransitionIndexes.includes(storyPart) &&
      storyPart != 0 &&
      scrollDirection.current === TScrollDirection.Down &&
      bgTransitionIndex.current + 2 < bgTransitions.length
    ) {
      console.log("First if");
      bgTransitionIndex.current++;
      setColorFrom(bgTransitions[bgTransitionIndex.current].color);
      setColorTo(bgTransitions[bgTransitionIndex.current + 1].color);
    } else if (
      (console.log("first else if"),
      bgTransitionIndexes.includes(storyPart) &&
        storyPart != bgTransitionIndexes[bgTransitionIndexes.length - 1] &&
        scrollDirection.current === TScrollDirection.Up &&
        bgTransitionIndex.current > 0)
    ) {
      bgTransitionIndex.current--;
      setColorFrom(bgTransitions[bgTransitionIndex.current].color);
      setColorTo(bgTransitions[bgTransitionIndex.current + 1].color);
    } else if (scrollDirectionChanged.current) {
      console.log("second else if");
      if (
        scrollDirection.current === TScrollDirection.Up &&
        bgTransitionIndex.current > 0 &&
        storyPart < bgTransitionIndexes[bgTransitionIndex.current]
      ) {
        console.log("first inner if");
        setColorFrom(bgTransitions[bgTransitionIndex.current - 1].color);
        setColorTo(bgTransitions[bgTransitionIndex.current].color);
        bgTransitionIndex.current--;
      }
      if (
        scrollDirection.current === TScrollDirection.Down &&
        bgTransitionIndex.current + 2 < bgTransitions.length &&
        storyPart > bgTransitionIndexes[bgTransitionIndex.current + 1]
      ) {
        console.log("second inner if");
        setColorFrom(bgTransitions[bgTransitionIndex.current + 1].color);
        setColorTo(bgTransitions[bgTransitionIndex.current + 2].color);
        bgTransitionIndex.current++;
      }
    }
    console.log(colorFrom, colorTo, animateColorProgress);

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
    console.log(children);

    return (
      AnimationTiming.fadeTextIn +
      AnimationTiming.translateTextIn +
      wpmToMs(wpm) * children.length
    );
  };

  useEffect(() => {
    if (!autoScroll) return;
    if (usedManualScroll.current) {
      setAutoScroll(false);
      return;
    }

    setTimeout(() => {
      if (!autoScroll) return;
      scroll(TScrollDirection.Down);
    }, getAutoScrollDelay());
  }, [storyPart, autoScroll]);

  useEffect(() => {
    if (storyPart <= 0) setStoryPart(0);
    // Update the URL when the story part changes
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

        {effectTransitions.map((transition) => {
          if (
            storyPart >= transition.startTransition - storyPartRenderWindow &&
            storyPart <= transition.endTransition + storyPartRenderWindow
          ) {
            return transition.effect;
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
