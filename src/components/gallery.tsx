import { useEffect } from "preact/hooks"
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function Gallery(){
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.row', {
      scrollTrigger: {
        trigger: '.no-scroll',
        start: 'center bottom',
        scrub: 0.3,
      },
      x: -600,
    });
    gsap.to(".fadein", {
      duration: 0.3,
      opacity: 1,
      delay: 1
    });
  }, [])


  return <div class="overflow-y-auto snap-x md:snap-none no-scroll">
    <div class="flex gap-6 h-full md:h-[560px] pb-4 mx-6 row fadein opacity-0">
      <img class="aspect-square bg-zinc-800 object-cover snap-center rounded-3xl shrink-0" src="/assets/expo-1.jpg"/>
      <img class="aspect-square bg-zinc-800 object-cover snap-center rounded-3xl shrink-0" src="/assets/expo-2.jpg"/>
      <img class="aspect-square bg-zinc-800 object-cover snap-center rounded-3xl shrink-0" src="/assets/expo-3.jpg"/>
      <div class="aspect-square bg-zinc-800 object-cover snap-center rounded-3xl shrink-0"></div>
      <div class="aspect-square bg-zinc-800 object-cover snap-center rounded-3xl shrink-0"></div>
    </div>
  </div>
}