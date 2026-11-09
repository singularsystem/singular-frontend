"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type Props = {
  title: string;
  description: string;
  circleText: string | number;
  onClick?: () => void;
};

export function PEICardSerie({
  title,
  description,
  circleText,
  onClick,
}: Props) {
  return (
    <Card
      className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={() => {
        onClick?.();
      }}
    >
      <CardHeader className="flex flex-col items-center mb-6">
        <div className="h-16 w-16 border bg-blue-500 rounded-full mb-4 flex items-center justify-center">
          <span className="text-4xl text-white leading-none">{circleText}</span>
        </div>

        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-base text-center">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
