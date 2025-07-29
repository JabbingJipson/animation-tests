import { useState, useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

interface AnimatedMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const AnimatedMenuButton = ({ isOpen, onToggle, className = "" }: AnimatedMenuButtonProps) => {
  const { RiveComponent, rive } = useRive({
    src: "/MenuButton.riv",
    autoplay: true,
    stateMachines: "State Machine 1",
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      console.log("MenuButton.riv loaded successfully!");
    },
  });

  // Update the state machine input when isOpen changes
  useEffect(() => {
    if (rive) {
      console.log("Rive instance available, updating isClicked input...");
      const inputs = rive.stateMachineInputs("State Machine 1");
      console.log("Available inputs:", inputs);
      const isClickedInput = inputs.find(input => input.name === "isClicked");
      if (isClickedInput) {
        console.log(`Setting isClicked to ${isOpen}`);
        
        // Clear any existing timeouts
        const timeoutId = setTimeout(() => {
          isClickedInput.value = isOpen;
        }, 0);
        
        // Also set immediately
        isClickedInput.value = isOpen;
        
        return () => clearTimeout(timeoutId);
      } else {
        console.log("isClicked input not found!");
      }
    } else {
      console.log("Rive instance not available yet");
    }
  }, [rive, isOpen]);

  const handleClick = () => {
    console.log("Menu button clicked, current isOpen:", isOpen);
    
    // Immediately update the Rive input if available
    if (rive) {
      const inputs = rive.stateMachineInputs("State Machine 1");
      const isClickedInput = inputs.find(input => input.name === "isClicked");
      if (isClickedInput) {
        // Set to the opposite of current state immediately
        isClickedInput.value = !isOpen;
      }
    }
    
    // Call the parent's onToggle function to update the isOpen state
    onToggle();
  };

  return (
    <div
      onClick={handleClick}
      className={`w-[120px] h-[120px] flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer ${className}`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="w-20 h-20 hover:brightness-150 transition-all duration-300">
        <RiveComponent className="w-full h-full" />
      </div>
    </div>
  );
};

export default AnimatedMenuButton; 