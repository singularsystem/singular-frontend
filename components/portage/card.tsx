"use client";
import { DivideIcon } from "lucide-react";

interface PortageCardProps {
  title: string;
  value: string;
  change: string;
  changeText: string;
  icon: typeof DivideIcon;
}

export function PortageCard({
  title,
  value,
  change,
  changeText,
  icon: Icon,
}: PortageCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#111C4E] mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-medium`}>{change}</span>
            <span className="text-gray-500 text-sm">{changeText}</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-[#0071CE] to-[#19D3C5] rounded-xl flex items-center justify-center shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default PortageCard;
