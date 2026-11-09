"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navitem";
import Link from "next/link";

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  pathname: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  popupRef: React.RefObject<HTMLDivElement | null>;
}

export function SidebarNavItem({
  item,
  isCollapsed,
  pathname,
  isOpen,
  setIsOpen,
  popupRef,
}: SidebarNavItemProps) {
  const isActive = pathname.startsWith(item.href);

  if (!item.children) {
    const content = (
      <Link
        href={item.href}
        className={cn(
          "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300",
          isActive
            ? "bg-gradient-to-r from-[#0071CE] to-[#19D3C5] shadow-lg text-white"
            : "text-gray-400 hover:bg-white/10 hover:text-white",
          isCollapsed && "justify-center",
        )}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span>{item.title}</span>}
      </Link>
    );

    return isCollapsed ? (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">
            <span>{item.title}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      content
    );
  }

  const hasActiveChild =
    item.children?.some((child) => pathname === child.href || (child.href === "/livros/gerar" && pathname.startsWith("/livros"))) ?? false;

  return (
    <div className="relative">
      {isCollapsed ? (
        <div className="relative">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn(
                    "w-full flex items-center justify-center p-3 rounded-xl transition-all duration-300",
                    hasActiveChild &&
                      "bg-gradient-to-r from-[#0071CE] to-[#19D3C5] text-white shadow-lg",
                    !hasActiveChild &&
                      "text-gray-400 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              </TooltipTrigger>

              <TooltipContent side="right">
                <span>{item.title}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isOpen && (
            <div
              ref={popupRef}
              className="absolute left-full top-0 ml-4 w-56 bg-[#111C4E] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200"
            >
              <div className="p-3 border-b border-white/5 bg-white/5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {item.title}
                </p>
              </div>
              <div className="py-2">
                {item.children.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 text-sm transition-all",
                      pathname === sub.href || (sub.href === "/livros/gerar" && pathname.startsWith("/livros"))
                        ? "text-[#19D3C5] bg-white/5 font-medium"
                        : "text-gray-300 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {sub.icon && <sub.icon className="w-4 h-4" />}
                    <span>{sub.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={item.title} className="border-none">
            <AccordionTrigger
              className={cn(
                "flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 hover:no-underline",
                "transition-all duration-300",
                isActive && "text-white font-medium",
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pl-4 mt-1 space-y-1">
              {item.children.map((sub) => {
                const activeChild = pathname === sub.href || (sub.href === "/livros/gerar" && pathname.startsWith("/livros"));
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg text-sm transition-all",
                      activeChild
                        ? "bg-gradient-to-r from-[#0071CE] to-[#19D3C5] shadow-lg text-white"
                        : "text-gray-400 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {sub.icon && <sub.icon className="w-4 h-4" />}
                    <span>{sub.title}</span>
                  </Link>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
