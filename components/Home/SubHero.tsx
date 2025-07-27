import Image from "next/image";

export default function SubHero() {
  return (
    <section className="w-full bg-white px-4 md:px-16 py-12 text-center">
      <h2 className="text-3xl md:text-5xl font-serif tracking-wide uppercase">
        Are not<br />
        <span className="font-semibold">to be</span><br />
        missed
      </h2>
      <p className="mt-4 text-sm md:text-base text-gray-600">
        A selection of pieces from new and past<br />
        collections you may like.
      </p>
    </section>
  );
}
