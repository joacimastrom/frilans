"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

interface CollapsibleCardProps {
  title: ReactNode;
  description?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function CollapsibleCard({
  title,
  description,
  defaultOpen = false,
  children,
  footer,
  className,
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader
        className="border-b px-6 py-4 cursor-pointer select-none"
        onClick={toggleCard}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center justify-between gap-2 text-lg font-semibold text-gray-80 w-full">
            {title}
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
              <span className="sr-only">{isOpen ? "Collapse" : "Expand"}</span>
            </Button>
          </CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
      >
        <div ref={contentRef}>
          <CardContent>{children}</CardContent>
          {footer && <CardFooter>{footer}</CardFooter>}
        </div>
      </div>
    </Card>
  );
}
