// smooth scroll to anchor by id component

export const scrollToAnchor = (anchor) => {
  const anchorElement = document.getElementById(anchor)
  if (anchorElement) {
    anchorElement.scrollIntoView({ behavior: "smooth" })
  }
}

export function AnchorLink({ anchor, children }) {
  return (
    <a
      href={`#${anchor}`}
      onClick={(e) => {
        e.preventDefault()
        scrollToAnchor(anchor)
      }}
    >
      {children}
    </a>
  )
}
