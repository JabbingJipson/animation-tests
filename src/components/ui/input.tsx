import * as React from "react";
import { motion } from "framer-motion";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    return (
      <motion.div
        whileHover={{ backgroundColor: "rgba(186,186,186,0.05)" }}
        className={"w-full h-10 rounded-md " + (className || "")}
      >
      <input
        ref={ref}
        {...props}
          onFocus={e => {
            setIsFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          className={
            "w-full h-full px-3 rounded-md bg-white/10 border text-white placeholder:text-zinc-400 outline-none transition " +
            (isFocused ? "border-blue-400" : "border-zinc-400/20")
          }
          style={{ fontSize: 14, ...style }}
      />
      </motion.div>
    );
  }
);
Input.displayName = "Input";

export { Input };
