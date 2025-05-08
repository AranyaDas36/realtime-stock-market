import * as React from "react"

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

/**
 * A simplified version of Radix UI's Slot component
 * This component will merge its props with its child's props
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, ...props }, ref) => {
  if (!React.isValidElement(children)) {
    return null
  }

  return React.cloneElement(children, {
    ...props,
    //@ts-ignore
    ...children.props,
    ref: ref
      ? // Merge refs if both exist
        (node: HTMLElement) => {
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node

          const { ref: childRef } = children as any
          if (typeof childRef === "function") childRef(node)
          else if (childRef) childRef.current = node
        }
        //@ts-ignore
      : children.props.ref,
  })
})
Slot.displayName = "Slot"

export { Slot }
