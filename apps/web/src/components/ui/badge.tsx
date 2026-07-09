import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "border-red-200 bg-red-100 text-red-800 focus-visible:ring-red-200 dark:border-red-900 dark:bg-red-950 dark:text-red-300 dark:focus-visible:ring-red-900 [a]:hover:bg-red-200/80 dark:[a]:hover:bg-red-900/80",
        success:
          "border-emerald-200 bg-emerald-100 text-emerald-800 focus-visible:ring-emerald-200 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:focus-visible:ring-emerald-800 [a]:hover:bg-emerald-200/80 dark:[a]:hover:bg-emerald-900/80",
        info:
          "border-sky-200 bg-sky-100 text-sky-800 focus-visible:ring-sky-200 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300 dark:focus-visible:ring-sky-800 [a]:hover:bg-sky-200/80 dark:[a]:hover:bg-sky-900/80",
        warning:
          "border-amber-200 bg-amber-100 text-amber-900 focus-visible:ring-amber-200 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300 dark:focus-visible:ring-amber-800 [a]:hover:bg-amber-200/80 dark:[a]:hover:bg-amber-900/80",
        violet:
          "border-violet-200 bg-violet-100 text-violet-800 focus-visible:ring-violet-200 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300 dark:focus-visible:ring-violet-800 [a]:hover:bg-violet-200/80 dark:[a]:hover:bg-violet-900/80",
        muted:
          "border-stone-300 bg-stone-100 text-stone-700 focus-visible:ring-stone-300 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:focus-visible:ring-stone-600 [a]:hover:bg-stone-200/80 dark:[a]:hover:bg-stone-700/80",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
