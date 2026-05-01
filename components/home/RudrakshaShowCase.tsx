import { RudrakshaItem } from "@/lib/data/rudraksha-data";
import Image from "next/image";


type Props = {
  item: RudrakshaItem;
};

export default function RudrakshaShowCase({ item }: Props) {
  const textBlock = (
    <div className="flex items-center px-6 py-14 sm:px-10 lg:px-16 xl:px-20">
      <div className="max-w-[620px]">
        <h2 className="font-serif text-4xl leading-tight text-[#111111] sm:text-5xl">
          {item.title}
        </h2>
        <p className="mt-8 text-base leading-8 text-[#1f1f1f] sm:text-[20px] sm:leading-10">
          {item.description}
        </p>
      </div>
    </div>
  );

  const imageBlock = (
    <div className="relative min-h-[520px] overflow-hidden">
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f4f1ec]/60 to-transparent lg:w-32" />
    </div>
  );

  return (
    <section className="grid min-h-[720px] grid-cols-1 lg:grid-cols-2 bg-[#fdf8f2] mt-10">
      {item.imageFirst ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </section>
  );
}