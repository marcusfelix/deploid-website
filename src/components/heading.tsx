import { IconCircleDotted } from "@tabler/icons-preact";
import { useEffect } from "preact/hooks"
import { gsap } from "gsap";
import { TextPlugin } from "gsap/dist/TextPlugin";

export default function Heading() {4
  
  useEffect(() => {
    gsap.registerPlugin(TextPlugin);
    gsap.to("#heading", {
      duration: 1,
      text: "Unlimited design & development partner — one task at a time",
      ease: "none"
    });
    gsap.to(".fadein", {
      duration: 0.3,
      opacity: 1,
      delay: 1
    });
  }, [])

  return <div class="flex flex-col items-start max-w-5xl py-10 md:py-28 gap-10">
    <h1 class="text-6xl md:text-8xl font-semibold tracking-tight" id="heading"></h1>
    <p class="text-2xl text-zinc-500 max-w-2xl fadein opacity-0">Best time to value for your digital product development with unlimited services from design to code.</p>
    <div class="flex flex-col md:flex-row items-start gap-6 fadein opacity-0">
      <a href="https://app.slack.com/client/T06013X3P9S/D05UY4CPXTR" target="_blank" class="bg-blue-700 text-blue-100 text-xl px-5 py-3 rounded-lg">Let's talk — <span class="opacity-50">Slack</span></a>
      <div class="flex items-center justify-center gap-2 text-lg">
        <span class="flex items-center justify-center relative aspect-square h-12 w-12">
          <span class="slow-spin absolute text-zinc-500"><IconCircleDotted size={48} /></span>
          <span class="pt-[1px] font-bold">5</span>
        </span>
        Spots available
      </div>
    </div>
  </div>
}