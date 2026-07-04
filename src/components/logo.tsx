import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_ASPECT_RATIO = 1126 / 236;

export function Logo({
  variant = "dark",
  height = 40,
  className,
}: {
  variant?: "dark" | "light";
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src={variant === "light" ? "/logo-white.png" : "/logo.png"}
      alt="GOxpress Way"
      width={Math.round(height * LOGO_ASPECT_RATIO)}
      height={height}
      className={cn("w-auto", className)}
      style={{ height, width: "auto" }}
    />
  );
}
