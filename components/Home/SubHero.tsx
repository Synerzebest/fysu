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

      <h3 className="mt-16 text-xl md:text-2xl font-medium tracking-wide uppercase">
        New in
      </h3>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
        {/* Product 1 */}
        <div className="w-full max-w-xs flex flex-col items-center">
          <div className="bg-gray-100 rounded-2xl p-6">
            <Image
              src="/images/products/blazer.png"
              alt="Denim Jacket"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
          <p className="mt-4 text-sm tracking-wide uppercase font-semibold">Denim Jacket</p>
          <p className="text-sm mt-1">415 EUR</p>
          <p className="text-xs mt-1 text-gray-500 tracking-widest">1 COLOR</p>
        </div>

        {/* Product 2 */}
        <div className="w-full max-w-xs flex flex-col items-center">
          <div className="bg-gray-100 rounded-2xl p-6">
            <Image
              src="/images/products/flower-jeans.png" // remplace par le bon chemin
              alt="Flower Jeans"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
          <p className="mt-4 text-sm tracking-wide uppercase font-semibold">Flower Jeans</p>
          <p className="text-sm mt-1">425 EUR</p>
          <p className="text-xs mt-1 text-gray-500 tracking-widest">1 COLOR</p>
        </div>
      </div>
    </section>
  );
}
