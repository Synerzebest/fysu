import React from "react";

const Origin = () => {
  return (
    <section
      className="
        sm:w-[90%] sm:rounded-xl 
        mx-auto w-full 
        bg-transparent text-foreground 
        px-6 py-20 md:py-40 lg:py-60 
        font-serif relative
      "
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-lg md:text-3xl font-normal tracking-widest uppercase">
          CHAPTER 1
        </h2>

        {/* Rouge premium adapté dark */}
        <p className="
          mt-2 text-2xl md:text-xl 
          tracking-widest uppercase
          text-[#9B2E31] 
          dark:text-[#d65c60]
          transition-colors duration-300
        ">
          THE PRELUDE
        </p>
      </div>

      <div className="
        max-w-xl mx-auto 
        mt-40 md:mt-60 lg:mt-80 
        text-sm md:text-base 
        leading-relaxed tracking-wide 
        text-foreground text-left
      ">
        <p>
          This prelude stands as an echo, a quiet overture before the true exchange begins.
          It carries the memory of what FYSU once was, the clarity of what it is meant to
          become. Its shape will bloom naturally, almost imperceptibly,
          and only a few will witness its first outlines and be the sunbeam of this project.
        </p>

        <p className="mt-8">Thank you.</p>
        <p className="mt-4">See you soon,</p>
        <p className="mt-4">David</p>
      </div>
    </section>
  );
};

export default Origin;
