import { HiLightningBolt } from "react-icons/hi";

const Logo = () => {
  return (
    <div className="flex gap-1 text-3xl text-fg items-center font-medium">
      <HiLightningBolt size={15} className="text-accent" />
      <p className="text-2xl">
        <span className="">Axis</span>
      </p>
    </div>
  );
};

export default Logo;
