import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-lime-400 text-stone-900 hover:bg-lime-500 active:bg-lime-600 focus:ring-lime-400",
        secondary:
          "bg-stone-200 text-stone-900 hover:bg-stone-300 active:bg-stone-400 focus:ring-stone-300",
        outline:
          "border-2 border-lime-600 text-lime-700 hover:bg-lime-50 active:bg-lime-100 focus:ring-lime-600",
        ghost:
          "text-stone-700 hover:bg-stone-100 active:bg-stone-200 focus:ring-stone-300",
        danger:
          "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
