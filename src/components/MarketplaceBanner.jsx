import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";

const COLORS_TOP = ["#d4b483", "#d48b83 ", "#d483cf ", "#83d493 "];

const MarketplaceBanner = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #181a1d 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 40px ${color}`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative grid h-full place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="max-w-3xl bg-linear-to-br from-white to-gray-400 bg-clip-text text-center text-4xl font-bold leading-8 text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-17">
          Give your cards some <br />
          <span className="italic display">swagger</span>
        </h1>
        <p className="text-fg/60 mt-2 text-center max-w-xs sm:max-w-xl leading-7">
          {" "}
          Check out the marketplace; a curation of designs made by expert
          graphic designers for card designs we can work with.
        </p>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
};

export default MarketplaceBanner;
