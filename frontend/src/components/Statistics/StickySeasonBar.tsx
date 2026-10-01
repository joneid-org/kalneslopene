import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function StickySeasonBar({ title, children }: Props) {
  return (
    <div className="sticky top-14 z-40 -mx-3 flex flex-col gap-2 bg-gray-50/90 px-3 py-2 backdrop-blur-md sm:-mx-4 sm:px-4 md:top-17.5">
      <h2 className="font-display text-lg font-extrabold tracking-tight md:text-xl">
        {title}
      </h2>
      {children}
    </div>
  );
}
