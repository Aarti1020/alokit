import Image from "next/image";

export default function ImageBanner() {
  return (
      <section className="relative w-full overflow-hidden bg-black">
      <Image
        src="/images/Alokit Baner above footer.png"
        alt="Alokit banner"
        width={2048}
        height={469}
        priority
        className="h-auto w-full object-contain"
      />
    </section>
  );
}