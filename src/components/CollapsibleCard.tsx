"use client";

import type React from "react";

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
import { useEffect, useRef, useState } from "react";

interface CollapsibleCardProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
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
          <div>
            <CardTitle>
              {title}
              <Button variant="ghost" size="icon" className="shrink-0">
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
                <span className="sr-only">
                  {isOpen ? "Collapse" : "Expand"}
                </span>
              </Button>
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
      >
        <div ref={contentRef}>
          <CardContent className="flex gap-4">{children}</CardContent>
          {footer && <CardFooter>{footer}</CardFooter>}
        </div>
      </div>
    </Card>
  );
}
