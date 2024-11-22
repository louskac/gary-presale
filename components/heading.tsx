import { cn } from "@/lib/utils"

type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div" | "p"

const strokeStyles = {
  WebkitTextStroke: "12px hsl(var(--gary-blue))",
  textStroke: "12px hsl(var(--gary-blue))",
  paintOrder: "stroke fill",
}

export function Heading({
  children,
  tag,
  stroke = true,
  className,
}: {
  children: React.ReactNode
  tag?: Tag
  stroke?: boolean
  className?: string
}) {
  const Tag = tag || "h2"
  return (
    <Tag
      className={cn("text-4xl font-bold tracking-wider text-gary-yellow", className)}
      style={stroke ? strokeStyles : undefined}
    >
      {children}
    </Tag>
  )
}
