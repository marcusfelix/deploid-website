import { useEffect, useRef } from "preact/hooks"

export default function Gallery(){
  const ref = useRef()

  useEffect(() => {
    window.addEventListener('scroll', handle);
  }, [ref])

  const handle = () => {
    ref.current.scrollLeft = window.scrollY / 4
  }


  return <div class="overflow-y-auto snap-x md:snap-none px-6 no-scroll" ref={ref}>
    <div class="flex gap-6 h-full md:h-[560px] pb-4">
      <img class="aspect-square bg-zinc-800 object-cover snap-center rounded-3xl shrink-0" src="/assets/expo-1.jpg"/>
      <img class="aspect-square bg-zinc-800 object-cover snap-center rounded-3xl shrink-0" src="/assets/expo-2.jpg"/>
      <img class="aspect-square bg-zinc-800 object-cover snap-center rounded-3xl shrink-0" src="/assets/expo-3.jpg"/>
      <div class="aspect-square bg-zinc-800 object-cover snap-center rounded-3xl shrink-0"></div>
      <div class="aspect-square bg-zinc-800 object-cover snap-center rounded-3xl shrink-0"></div>
    </div>
  </div>
}