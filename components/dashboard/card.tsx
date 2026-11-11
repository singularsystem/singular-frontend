"use client";
import { DivideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string | React.ReactNode;
  changeText?: string | React.ReactNode;
  icon: typeof DivideIcon;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeText,
  icon: Icon,
  className,
}: StatsCardProps) {
  const hasFooter =
    (typeof change === "string" ? change.trim().length > 0 : !!change) ||
    (typeof changeText === "string"
      ? changeText.trim().length > 0
      : !!changeText);

  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1 ${className || ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-brand-navy mb-2">{value}</p>
          {hasFooter && (
            <div className="mt-3">
              {typeof changeText !== "string" ? (
                <div>{changeText}</div>
              ) : typeof change !== "string" ? (
                <div className="flex flex-wrap items-center gap-2">
                  {change}
                  {changeText.trim().length > 0 && (
                    <span className="text-xs text-slate-500">{changeText}</span>
                  )}
                </div>
              ) : (
                <p className="text-xs leading-snug text-slate-500">
                  {change.trim().length > 0 && (
                    <span className="font-semibold text-slate-700">
                      {change}{" "}
                    </span>
                  )}
                  {changeText.trim().length > 0 && <span>{changeText}</span>}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="w-12 h-12 shrink-0 bg-brand-navy text-white rounded-xl flex items-center justify-center shadow-lg mt-1">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
