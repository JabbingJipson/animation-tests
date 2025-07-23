import { useState, useEffect, useRef } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Upload, Play, Pause, RotateCcw, Zap, MousePointer, Move, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import FileUpload from "./FileUpload";

interface Animation {
  name: string;
  isPlaying: boolean;
}

interface StateMachineInput {
  name: string;
  type: string;
  value: any;
}

const RiveTester = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState('/default.riv');
  const [isPlaying, setIsPlaying] = useState(false);
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [stateMachines, setStateMachines] = useState<string[]>([]);
  const [stateMachineInputs, setStateMachineInputs] = useState<StateMachineInput[]>([]);
  const [selectedStateMachine, setSelectedStateMachine] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [testToggleValue, setTestToggleValue] = useState(false);
  const [sliderNumber, setSliderNumber] = useState(0);

  // Drag and drop state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const zoom = 0.7;
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastDropLocation, setLastDropLocation] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isHoveringPreview, setIsHoveringPreview] = useState(false);
  const isHoveringPreviewRef = useRef(isHoveringPreview);
  useEffect(() => { isHoveringPreviewRef.current = isHoveringPreview; }, [isHoveringPreview]);
  const originalOverflowRef = useRef<string | null>(null);

  // Restore isDragging state
  const [isDragging, setIsDragging] = useState(false);

  // Scrolling state
  // Remove isHoveringRiveAsset state
  const [isPageScrolling, setIsPageScrolling] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const onScroll = () => {
      setIsPageScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsPageScrolling(false), 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Create object URL when file is selected
  const handleFileSelect = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setSelectedFile(file);
      // Reset state when new file is loaded
      setAnimations([]);
      setStateMachines([]);
      setStateMachineInputs([]);
      setSelectedStateMachine(null);
      setInputValues({});
      setTestToggleValue(false);
      // Reset drag and drop state
      setPosition({ x: 0, y: 0 });
      setLastDropLocation({ x: 0, y: 0 });
    } else {
      setFileUrl(null);
      setSelectedFile(null);
    }
  };

  // State for debugging mouse events
  // State to track if pointer (mouse or finger) is currently down
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Ensure isDragging is false if isPointerDown is false
  useEffect(() => {
    if (!isPointerDown && isDragging) {
      setIsDragging(false);
    }
  }, [isPointerDown, isDragging]);

  // Ref to track previous isDragging state
  const prevIsDraggingRef = useRef(isDragging);
  const prevDropYRef = useRef(lastDropLocation.y);

  const { RiveComponent, rive } = useRive({
    src: fileUrl || "",
    autoplay: false,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      console.log("Rive file loaded successfully!");
    },
    onPlay: () => {
      setIsPlaying(true);
    },
    onPause: () => {
      setIsPlaying(false);
    },
  });

  // Rive arrow.riv for right-bound animation
  const { RiveComponent: ArrowRiveComponent } = useRive({
    src: '/arrow.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  // Handler for window mouseup (native event)
  const handleWindowMouseUp = (e: MouseEvent) => {
    // This function is no longer needed as dropRiveAsset is removed.
    // Keeping it here for now, but it will be removed in a subsequent edit.
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && isHoveredValue) { // Only allow drag if isHovered is true (desktop)
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
    setIsPointerDown(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newY = e.clientY - dragStart.y;
      setPosition({
        x: 0,
        y: Math.max(0, newY)
      });
    }
  };

  // State for debugging touch events
  // Handler for window touchend (native event)
  const handleWindowTouchEnd = (e: TouchEvent) => {
    setIsDragging(false);
    // This function is no longer needed as dropRiveAsset is removed.
    // Keeping it here for now, but it will be removed in a subsequent edit.
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) { // On touch devices, allow drag regardless of isHovered
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
    setIsPointerDown(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const newY = touch.clientY - dragStart.y;
      setPosition({
        x: 0,
        y: Math.max(0, newY)
      });
    }
  };

  // State for debugging handleTouchEnd
  // Handler for React touchend
  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false); // Ensure dragging ends on touch end
    // Track last drop position on touch end
    const dropY = position.y;
    setLastDropLocation({ x: 0, y: dropY });
    console.log('Dropping asset at Y:', dropY, 'MouseRelease:', inputValues.MouseRelease);
    animateToCenter();
    setIsPointerDown(false);
    // MouseRelease logic:
    if (rive && selectedStateMachine) {
      const inputs = rive.stateMachineInputs(selectedStateMachine);
      const mouseReleaseInput = inputs.find(i => i.name === "MouseRelease");
      if (mouseReleaseInput) {
        if (!mouseReleaseInput.value && dropY >= 100) {
          // Only go from false to true if dropY >= 100
          mouseReleaseInput.value = true;
          setInputValues(prev => ({ ...prev, MouseRelease: true }));
        } else if (mouseReleaseInput.value) {
          // Always allow true to false
          mouseReleaseInput.value = false;
          setInputValues(prev => ({ ...prev, MouseRelease: false }));
        }
      }
    }
  };

  // Auto-return animation function
  const animateToCenter = () => {
    if (position.y === 0) return; // Only check Y since X is always 0
    
    setIsAnimating(true);
    const startPosition = { ...position };
    const startTime = performance.now();
    const duration = 300; // 300ms animation duration
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out function (cubic-bezier)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const newY = startPosition.y * (1 - easeOut);
      
      setPosition({ x: 0, y: Math.max(0, newY) }); // Ensure Y never goes negative
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPosition({ x: 0, y: 0 });
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Function to toggle MouseRelease input
  const triggerMouseRelease = () => {
    if (rive && selectedStateMachine) {
      try {
        const inputs = rive.stateMachineInputs(selectedStateMachine);
        const mouseReleaseInput = inputs.find(i => i.name === "MouseRelease");
        if (mouseReleaseInput) {
          // Get current value and toggle it
          const currentValue = mouseReleaseInput.value;
          const newValue = !currentValue;
          mouseReleaseInput.value = newValue;
          console.log(`MouseRelease toggled: ${newValue}`);
          
          // Update the input values state to reflect the change
          setInputValues(prev => ({ ...prev, MouseRelease: newValue }));
        }
      } catch (error) {
        console.error("Error toggling MouseRelease:", error);
      }
    }
  };

  // Remove dropRiveAsset, and move last drop logic to handleMouseUp

  const handleMouseUp = (e?: React.MouseEvent) => {
    // Track last drop position on mouse up
    const dropY = position.y;
    setLastDropLocation({ x: 0, y: dropY });
    console.log('Dropping asset at Y:', dropY, 'MouseRelease:', inputValues.MouseRelease);
    animateToCenter();
    setIsPointerDown(false);
    // MouseRelease logic:
    if (rive && selectedStateMachine) {
      const inputs = rive.stateMachineInputs(selectedStateMachine);
      const mouseReleaseInput = inputs.find(i => i.name === "MouseRelease");
      if (mouseReleaseInput) {
        if (!mouseReleaseInput.value && dropY >= 100) {
          // Only go from false to true if dropY >= 100
          mouseReleaseInput.value = true;
          setInputValues(prev => ({ ...prev, MouseRelease: true }));
        } else if (mouseReleaseInput.value) {
          // Always allow true to false
          mouseReleaseInput.value = false;
          setInputValues(prev => ({ ...prev, MouseRelease: false }));
        }
      }
    }
  };

  // Touch handlers for mobile support
  const handleDoubleClick = () => {
    setPosition({ x: 0, y: 0 });
    setLastDropLocation({ x: 0, y: 0 });
  };

  const handlePreviewMouseEnter = () => {
    setIsHoveringPreview(true);
    if (originalOverflowRef.current === null) {
      originalOverflowRef.current = document.body.style.overflow;
    }
    document.body.style.overflow = 'hidden';
  };

  const handlePreviewMouseLeave = () => {
    setIsHoveringPreview(false);
    if (originalOverflowRef.current !== null) {
      document.body.style.overflow = originalOverflowRef.current;
      originalOverflowRef.current = null;
    }
  };

  // Extract animations and state machines when rive instance is available
  useEffect(() => {
    if (rive) {
      const extractContent = () => {
        try {
          console.log("Extracting content from Rive instance...");
          
          // Get animations - use the public API
          const animationNames = rive.animationNames;
          if (animationNames && animationNames.length > 0) {
            const animList = animationNames.map(name => ({
              name,
              isPlaying: false
            }));
            setAnimations(animList);
            console.log("Animations found:", animationNames);
          }

          // Get state machines
          const stateMachineNames = rive.stateMachineNames;
          if (stateMachineNames && stateMachineNames.length > 0) {
            setStateMachines(stateMachineNames);
            const firstStateMachine = stateMachineNames[0];
            setSelectedStateMachine(firstStateMachine);
            console.log("State machines found:", stateMachineNames);
            console.log("Selected state machine:", firstStateMachine);
            
            // Play the first state machine by default
            try {
              rive.play(firstStateMachine);
              console.log(`Playing state machine: ${firstStateMachine}`);
              
              // Get inputs immediately after playing
              setTimeout(() => {
                const inputs = rive.stateMachineInputs(firstStateMachine);
                console.log("Inputs after playing state machine:", inputs);
                
                if (inputs && inputs.length > 0) {
                  const inputList = inputs.map(input => ({
                    name: input.name,
                    type: input.type.toString(),
                    value: input.value
                  }));
                  setStateMachineInputs(inputList);
                  
                  // Initialize input values
                  const initialValues: Record<string, any> = {};
                  inputs.forEach(input => {
                    initialValues[input.name] = input.value;
                  });
                  setInputValues(initialValues);
                  
                  console.log("State machine inputs processed:", inputList);
                  console.log("Initial input values:", initialValues);
                } else {
                  console.log("No inputs found for state machine:", firstStateMachine);
                  setStateMachineInputs([]);
                  setInputValues({});
                }
              }, 100);
              
            } catch (error) {
              console.error(`Error playing state machine ${firstStateMachine}:`, error);
            }
          }
        } catch (error) {
          console.error("Error extracting content:", error);
        }
      };

      // Try to extract content immediately
      extractContent();

      // Also try after a short delay to ensure everything is loaded
      const timer = setTimeout(extractContent, 1000);
      return () => clearTimeout(timer);
    }
  }, [rive]); // Remove selectedStateMachine from dependency to avoid infinite loop

  // Separate effect to handle state machine changes
  useEffect(() => {
    if (rive && selectedStateMachine) {
      console.log("State machine changed to:", selectedStateMachine);
      
      try {
        // Play the selected state machine
        rive.play(selectedStateMachine);
        console.log(`Playing state machine: ${selectedStateMachine}`);
        
        // Get inputs for the selected state machine with a delay
        setTimeout(() => {
          const inputs = rive.stateMachineInputs(selectedStateMachine);
          console.log("Inputs for", selectedStateMachine, ":", inputs);
          console.log("Inputs array length:", inputs?.length);
          
          if (inputs && inputs.length > 0) {
            console.log("Processing inputs:", inputs);
            const inputList = inputs.map(input => {
              console.log("Processing input:", input.name, input.type, input.value);
              return {
                name: input.name,
                type: input.type.toString(),
                value: input.value
              };
            });
            setStateMachineInputs(inputList);
            
            // Initialize input values
            const initialValues: Record<string, any> = {};
            inputs.forEach(input => {
              initialValues[input.name] = input.value;
            });
            setInputValues(initialValues);
            
            console.log("Updated state machine inputs:", inputList);
            console.log("Updated input values:", initialValues);
          } else {
            console.log("No inputs found for state machine:", selectedStateMachine);
            setStateMachineInputs([]);
            setInputValues({});
          }
        }, 200);
        
      } catch (error) {
        console.error(`Error handling state machine change to ${selectedStateMachine}:`, error);
      }
    }
  }, [rive, selectedStateMachine]);

  const handlePlay = () => {
    if (rive) {
      rive.play();
    }
  };

  const handlePause = () => {
    if (rive) {
      rive.pause();
    }
  };

  const handleReset = () => {
    if (rive) {
      rive.reset();
    }
  };

  const playAnimation = (animationName: string) => {
    if (rive) {
      try {
        rive.play(animationName);
        console.log(`Playing animation: ${animationName}`);
      } catch (error) {
        console.error(`Error playing animation ${animationName}:`, error);
      }
    }
  };

  const playStateMachine = (stateMachineName: string) => {
    if (rive) {
      try {
        rive.play(stateMachineName);
        setSelectedStateMachine(stateMachineName);
        console.log(`Playing state machine: ${stateMachineName}`);
      } catch (error) {
        console.error(`Error playing state machine ${stateMachineName}:`, error);
      }
    }
  };

  const updateInputValue = (inputName: string, value: any) => {
    if (rive && selectedStateMachine) {
      try {
        const inputs = rive.stateMachineInputs(selectedStateMachine);
        const input = inputs.find(i => i.name === inputName);
        if (input) {
          // Update the Rive input value
          input.value = value;
          
          // Update local state
          setInputValues(prev => ({ ...prev, [inputName]: value }));
          
          console.log(`Updated input: ${inputName} = ${value}`);
          console.log(`Input type: ${input.type}, New value: ${input.value}`);
        }
      } catch (error) {
        console.error(`Error updating input ${inputName}:`, error);
      }
    }
  };

  const triggerInput = (inputName: string) => {
    if (rive && selectedStateMachine) {
      try {
        const inputs = rive.stateMachineInputs(selectedStateMachine);
        const input = inputs.find(i => i.name === inputName);
        if (input) {
          input.fire();
          console.log(`Triggered input: ${inputName}`);
        }
      } catch (error) {
        console.error(`Error triggering input ${inputName}:`, error);
      }
    }
  };

  const refreshInputs = () => {
    if (rive && selectedStateMachine) {
      console.log("Manually refreshing inputs for:", selectedStateMachine);
      const inputs = rive.stateMachineInputs(selectedStateMachine);
      console.log("Manual refresh - inputs found:", inputs);
      
      if (inputs && inputs.length > 0) {
        const inputList = inputs.map(input => ({
          name: input.name,
          type: input.type.toString(),
          value: input.value
        }));
        console.log("Manual refresh - inputList before setState:", inputList);
        setStateMachineInputs(inputList);
        
        const initialValues: Record<string, any> = {};
        inputs.forEach(input => {
          initialValues[input.name] = input.value;
        });
        setInputValues(initialValues);
        
        console.log("Manual refresh - updated inputs:", inputList);
        console.log("Manual refresh - updated values:", initialValues);
        
        // Force a re-render by updating state again
        setTimeout(() => {
          console.log("Manual refresh - current stateMachineInputs:", stateMachineInputs);
          console.log("Manual refresh - current inputValues:", inputValues);
        }, 100);
      } else {
        console.log("Manual refresh - no inputs found");
        setStateMachineInputs([]);
        setInputValues({});
      }
    }
  };

  const renderInputControl = (input: StateMachineInput) => {
    const currentValue = inputValues[input.name] ?? input.value;
    
    switch (input.type) {
      case 'boolean':
        return (
          <div key={input.name} className="flex items-center space-x-4 p-3 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                checked={Boolean(currentValue)}
                onCheckedChange={(checked) => {
                  console.log(`Toggling ${input.name} from ${currentValue} to ${checked}`);
                  updateInputValue(input.name, checked);
                }}
              />
              <span className="font-medium">{input.name}</span>
            </div>
            <Badge variant="outline">Boolean</Badge>
            <span className="text-sm text-gray-500">
              {Boolean(currentValue) ? 'True' : 'False'}
            </span>
          </div>
        );
      
      case 'number':
        return (
          <div key={input.name} className="space-y-2 p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">{input.name}</span>
              <Badge variant="outline">Number</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Slider
                value={[currentValue]}
                onValueChange={([value]) => updateInputValue(input.name, value)}
                max={100}
                min={0}
                step={1}
                className="flex-1"
              />
              <span className="text-sm font-mono w-12">{currentValue}</span>
            </div>
          </div>
        );
      
      case 'trigger':
        return (
          <div key={input.name} className="flex items-center space-x-4 p-3 border rounded-lg">
            <Button
              onClick={() => triggerInput(input.name)}
              variant="outline"
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              {input.name}
            </Button>
            <Badge variant="outline">Trigger</Badge>
          </div>
        );
      
      default:
        return (
          <div key={input.name} className="flex items-center space-x-4 p-3 border rounded-lg">
            <span className="font-medium">{input.name}</span>
            <Badge variant="outline">{input.type}</Badge>
            <span className="text-sm text-gray-500">
              Value: {String(currentValue)}
            </span>
          </div>
        );
    }
  };

  // Whenever sliderNumber changes, update the Rive input 'Speed' if it exists
  useEffect(() => {
    if (rive && rive.stateMachineNames && rive.stateMachineNames.length > 0) {
      const stateMachineName = rive.stateMachineNames[0];
      const inputs = rive.stateMachineInputs(stateMachineName);
      const speedInput = inputs.find(i => i.name === "Speed");
      if (speedInput) {
        speedInput.value = sliderNumber;
        // Optionally log for debug:
        // console.log("Set Rive input 'Speed' to", sliderNumber);
      }
    }
  }, [sliderNumber, rive]);

  useEffect(() => {
    if (!isHoveringPreview && isDragging) {
      // This effect is no longer needed as dropRiveAsset is removed.
      // Keeping it here for now, but it will be removed in a subsequent edit.
    }
  }, [isHoveringPreview, isDragging]);

  // Ensure dragging ends on mouseup/touchend anywhere (trackpad fix)
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleWindowMouseUp);
      window.addEventListener('touchend', handleWindowTouchEnd);
      return () => {
        window.removeEventListener('mouseup', handleWindowMouseUp);
        window.removeEventListener('touchend', handleWindowTouchEnd);
      };
    }
  }, [isDragging]);

  // Track isHovered input for debug UI
  const [isHoveredValue, setIsHoveredValue] = useState(false);

  useEffect(() => {
    if (rive && selectedStateMachine) {
      const updateIsHovered = () => {
        const inputs = rive.stateMachineInputs(selectedStateMachine);
        const hoverInput = inputs.find(i => i.name === 'isHovered');
        if (hoverInput) setIsHoveredValue(!!hoverInput.value);
      };
      const interval = setInterval(updateIsHovered, 50);
      return () => clearInterval(interval);
    }
  }, [rive, selectedStateMachine]);

  // State for scaling the arrow.riv
  const [arrowScale, setArrowScale] = useState(5);
  const arrowMinScale = 5;
  const arrowMaxScale = 7;

  // Responsive: scale down arrow if window/container is too small
  const previewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleResize = () => {
      if (previewRef.current) {
        const containerWidth = previewRef.current.offsetWidth;
        // Arrow width at current scale
        const arrowWidth = 48 * arrowScale;
        // If arrow would overflow, scale it down to fit, but not below min
        if (arrowWidth > containerWidth) {
          const newScale = Math.max(arrowMinScale, Math.floor(containerWidth / 48));
          setArrowScale(newScale);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [arrowScale]);

  // Utility to detect touch device
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Rive Animation Tester
          </CardTitle>
          <CardDescription>
            Upload a Rive file to preview and control animations through state machine inputs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload 
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
        </CardContent>
      </Card>

      {fileUrl && (
        <div ref={previewRef} className="w-full max-w-full aspect-square bg-neutral-900 rounded-lg overflow-hidden border-2 border-neutral-800 mx-auto">
          {/* Container for Rive preview and overlays */}
          <div className="relative w-full h-full">
            {/* Canvas Container */}
            <div
              ref={canvasRef}
              className="w-full h-full relative cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={e => { handlePreviewMouseLeave(); setIsDragging(false); }}
              onMouseEnter={handlePreviewMouseEnter}
              onDoubleClick={handleDoubleClick}
              style={{
                touchAction: 'none',
                cursor: isHoveredValue
                  ? (isDragging ? 'grabbing' : 'grab')
                  : 'default'
              }}
            >
              {/* Rive Component with Transform */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : isAnimating ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                <RiveComponent className="w-full h-full" />
              </div>
              {/* MouseRelease threshold line at y=100px */}
              {(() => {
                // Calculate opacity and color based on position.y
                const y = position.y;
                const threshold = 100;
                const t = Math.max(0, Math.min(1, y / threshold)); // 0 at origin, 1 at threshold
                const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
                const baseOpacity = isTouchDevice ? 1 : (isHoveredValue ? 1 : 0.6);
                let opacity = baseOpacity * (1 - t); // 1 or 0.6 at origin, 0 at threshold
                if (inputValues.MouseRelease) opacity = 0;
                // Interpolate color from white to red
                const r = Math.round(255 * t + 255 * (1 - t)); // always 255
                const g = Math.round(255 * (1 - t)); // 255 to 0
                const b = Math.round(255 * (1 - t)); // 255 to 0
                const color = `rgba(${r},${g},${b},${opacity})`;
                return (
                  <div
                    className="absolute z-30 transition-all duration-300"
                    style={{
                      left: '50%',
                      top: 'calc(50% + 100px)',
                      width: '200px',
                      transform: 'translateX(-50%)',
                      borderTop: `1.5px dashed ${color}`,
                      opacity,
                      pointerEvents: 'none',
                    }}
                  />
                );
              })()}
            </div>
            {/* Non-interactive arrow.riv animation on right bound */}
            <div
              className="absolute z-40"
              style={{
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                width: `${48 * arrowScale}px`,
                height: `${128 * arrowScale}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowRiveComponent className="w-full h-full" />
            </div>
          </div>
        </div>
      )}

      {/* Simple slider UI for 'slider number' */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-base sm:text-lg">
          <MousePointer className="w-5 h-5" />
          slider number
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-2 sm:p-3 border rounded-lg bg-neutral-800">
          <input
            type="range"
            min={0}
            max={10}
            step={0.01}
            value={sliderNumber}
            onChange={e => setSliderNumber(parseFloat(e.target.value))}
            className="w-full sm:w-64 accent-blue-500"
          />
          <input
            type="number"
            min={0}
            max={10}
            step={0.01}
            value={sliderNumber}
            onChange={e => setSliderNumber(parseFloat(e.target.value))}
            className="w-full sm:w-20 px-2 py-1 rounded bg-neutral-900 text-white border border-neutral-700"
          />
          <span className="text-xs text-gray-300">{sliderNumber}</span>
        </div>
        {/* Arrow scale slider */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-2 sm:p-3 border rounded-lg bg-neutral-800 mt-4">
          <label className="text-sm font-medium text-white">Arrow Scale</label>
          <input
            type="range"
            min={arrowMinScale}
            max={arrowMaxScale}
            step={0.01}
            value={arrowScale}
            onChange={e => setArrowScale(parseFloat(e.target.value))}
            className="w-full sm:w-64 accent-blue-500"
          />
          <input
            type="number"
            min={arrowMinScale}
            max={arrowMaxScale}
            step={0.01}
            value={arrowScale}
            onChange={e => setArrowScale(parseFloat(e.target.value))}
            className="w-full sm:w-20 px-2 py-1 rounded bg-neutral-900 text-white border border-neutral-700"
          />
          <span className="text-xs text-gray-300">{arrowScale}</span>
        </div>
      </div>
    </div>
  );
};

export default RiveTester; 