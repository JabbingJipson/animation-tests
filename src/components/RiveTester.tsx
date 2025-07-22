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
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastDropLocation, setLastDropLocation] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

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
      setZoom(1); // Ensure initial zoom is 100% (within limits)
      setLastDropLocation({ x: 0, y: 0 });
    } else {
      setFileUrl(null);
      setSelectedFile(null);
    }
  };

  // Drag and drop handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button only
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newY = e.clientY - dragStart.y;
      setPosition({
        x: 0, // Lock X to 0
        y: Math.max(0, newY) // Only allow positive Y (downward movement)
      });
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

  const handleMouseUp = () => {
    setIsDragging(false);
    // Capture the last drop location before animation starts
    const dropY = position.y;
    setLastDropLocation({ x: 0, y: dropY });
    
    // Check current MouseRelease state and apply appropriate logic
    const currentMouseRelease = inputValues.MouseRelease;
    
    if (currentMouseRelease) {
      // If MouseRelease is true, any drop sets it to false
      triggerMouseRelease();
    } else {
      // If MouseRelease is false, only drops >= 100px set it to true
      if (dropY >= 100) {
        triggerMouseRelease();
      }
    }
    
    // Start auto-return animation
    animateToCenter();
  };

  // Touch handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const newY = touch.clientY - dragStart.y;
      setPosition({
        x: 0, // Lock X to 0
        y: Math.max(0, newY) // Only allow positive Y (downward movement)
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Capture the last drop location before animation starts
    const dropY = position.y;
    setLastDropLocation({ x: 0, y: dropY });
    
    // Check current MouseRelease state and apply appropriate logic
    const currentMouseRelease = inputValues.MouseRelease;
    
    if (currentMouseRelease) {
      // If MouseRelease is true, any drop sets it to false
      triggerMouseRelease();
    } else {
      // If MouseRelease is false, only drops >= 100px set it to true
      if (dropY >= 100) {
        triggerMouseRelease();
      }
    }
    
    // Start auto-return animation
    animateToCenter();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    const newZoom = e.deltaY > 0 
      ? Math.max(0.6, zoom - zoomFactor) // Minimum 60%
      : Math.min(1.4, zoom + zoomFactor); // Maximum 140%
    setZoom(newZoom);
  };

  const resetView = () => {
    setPosition({ x: 0, y: 0 });
    setZoom(1); // Reset to 100% (within limits)
    setLastDropLocation({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(1.4, prev + 0.1)); // Maximum 140%
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(0.6, prev - 0.1)); // Minimum 60%
  };

  const handleDoubleClick = () => {
    resetView();
  };

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
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              {selectedFile?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Rive Canvas with Drag and Drop */}
              <div className="relative w-full h-64 sm:h-96 md:h-[32rem] bg-neutral-900 rounded-lg overflow-hidden border-2 border-neutral-800">
                {/* Canvas Container */}
                <div
                  ref={canvasRef}
                  className="w-full h-full relative cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onDoubleClick={handleDoubleClick}
                  style={{
                    cursor: isDragging ? 'grabbing' : 'grab'
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
                </div>

                {/* Drag and Drop Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    onClick={resetView}
                    variant="outline"
                    size="sm"
                    className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={zoomIn}
                    variant="outline"
                    size="sm"
                    disabled={zoom >= 1.4}
                    className={`bg-black/50 text-white border-white/20 hover:bg-black/70 ${
                      zoom >= 1.4 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={zoomOut}
                    variant="outline"
                    size="sm"
                    disabled={zoom <= 0.6}
                    className={`bg-black/50 text-white border-white/20 hover:bg-black/70 ${
                      zoom <= 0.6 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </div>

                {/* Drag Instructions */}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg border border-white/20">
                  <div className="flex items-center gap-2">
                    <Move className="w-4 h-4" />
                    <span>Drag down • Scroll to zoom • Double-click to reset</span>
                  </div>
                </div>

                {/* Zoom Level Indicator */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg border border-white/20">
                  <div className="font-mono">
                    <div>{Math.round(zoom * 100)}%</div>
                    {zoom <= 0.6 && (
                      <div className="text-red-400 text-xs">Min: 60%</div>
                    )}
                    {zoom >= 1.4 && (
                      <div className="text-red-400 text-xs">Max: 140%</div>
                    )}
                  </div>
                </div>

                {/* Position Coordinates Display */}
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg border border-white/20">
                  <div className="font-mono">
                    <div>Down: {Math.round(position.y)}px</div>
                    {inputValues.MouseRelease ? (
                      <div className="text-red-400 text-xs mt-1">✓ Any drop → False</div>
                    ) : (
                      position.y >= 100 && (
                        <div className="text-green-400 text-xs mt-1">✓ Drop ≥ 100px → True</div>
                      )
                    )}
                  </div>
                </div>

                {/* Last Drop Location Display */}
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg border border-white/20">
                  <div className="font-mono">
                    <div className="text-yellow-300">Last Drop:</div>
                    <div>Down: {Math.round(lastDropLocation.y)}px</div>
                    {inputValues.MouseRelease ? (
                      <div className="text-red-400 text-xs mt-1">✓ MouseRelease: True</div>
                    ) : (
                      lastDropLocation.y >= 100 && (
                        <div className="text-green-400 text-xs mt-1">✓ MouseRelease: False</div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {selectedFile?.name}
                  </Badge>
                  {isPlaying && (
                    <Badge variant="secondary">
                      Playing
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handlePlay} 
                    disabled={isPlaying}
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  <Button 
                    onClick={handlePause} 
                    disabled={!isPlaying}
                    variant="outline"
                    size="sm"
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </Button>
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* State Machine Controls */}
              {stateMachines.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    State Machines
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stateMachines.map((stateMachine) => (
                      <Button
                        key={stateMachine}
                        onClick={() => playStateMachine(stateMachine)}
                        variant={selectedStateMachine === stateMachine ? "default" : "outline"}
                        size="sm"
                      >
                        {stateMachine}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* State Machine Input Controls - Primary Focus */}
              {stateMachineInputs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MousePointer className="w-5 h-5" />
                    State Machine Inputs
                  </h3>
                  <p className="text-sm text-gray-600">
                    Control animations by adjusting these inputs. For example, toggle "MouseRelease" to switch between Idle and Settle animations.
                  </p>
                  <div className="space-y-2">
                    {stateMachineInputs.map(renderInputControl)}
                  </div>
                </div>
              )}

              {/* Number Inputs for State Machine */}
              {selectedStateMachine && stateMachineInputs.filter(i => i.type === 'number').length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MousePointer className="w-5 h-5" />
                    Number Inputs
                  </h3>
                  <div className="space-y-4">
                    {stateMachineInputs.filter(i => i.type === 'number').map((input) => {
                      // Default min/max/step
                      let min = 0, max = 100, step = 0.01;
                      let value: number;
                      // Special case for 'speed' input
                      if (input.name === 'speed') {
                        min = 0;
                        max = 10;
                        step = 0.01;
                      } else if (rive && selectedStateMachine) {
                        // Try to get min/max/step from the real Rive input if available
                        const inputs = rive.stateMachineInputs(selectedStateMachine);
                        const target = inputs.find(i2 => i2.name === input.name);
                        if (target && typeof target.value === 'number') {
                          if ('min' in target && typeof target.min === 'number') min = target.min;
                          if ('max' in target && typeof target.max === 'number') max = target.max;
                          if ('step' in target && typeof target.step === 'number') step = target.step;
                        }
                      }
                      // Get value from state or input, fallback to min
                      const rawValue = inputValues[input.name] ?? input.value;
                      value = typeof rawValue === 'number' && !isNaN(rawValue) ? rawValue : min;
                      return (
                        <div key={input.name} className="flex flex-col gap-2 p-3 border rounded-lg bg-neutral-800">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white">{input.name}</span>
                            <Badge variant="outline">Number</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min={min}
                              max={max}
                              step={step}
                              value={value}
                              onChange={e => {
                                const newValue = parseFloat(e.target.value);
                                if (rive && selectedStateMachine) {
                                  const inputs = rive.stateMachineInputs(selectedStateMachine);
                                  const target = inputs.find(i2 => i2.name === input.name);
                                  if (target) {
                                    target.value = newValue;
                                    setInputValues(prev => ({ ...prev, [input.name]: newValue }));
                                    console.log(`Set ${input.name} to`, newValue);
                                  }
                                }
                              }}
                              className="w-64 accent-blue-500"
                            />
                            <input
                              type="number"
                              min={min}
                              max={max}
                              step={step}
                              value={value}
                              onChange={e => {
                                const newValue = parseFloat(e.target.value);
                                if (rive && selectedStateMachine) {
                                  const inputs = rive.stateMachineInputs(selectedStateMachine);
                                  const target = inputs.find(i2 => i2.name === input.name);
                                  if (target) {
                                    target.value = newValue;
                                    setInputValues(prev => ({ ...prev, [input.name]: newValue }));
                                    console.log(`Set ${input.name} to`, newValue);
                                  }
                                }
                              }}
                              className="w-20 px-2 py-1 rounded bg-neutral-900 text-white border border-neutral-700"
                            />
                            <span className="text-xs text-gray-300">{`Value: ${value} (type: ${typeof value})`}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fallback Input Display */}
              {stateMachineInputs.length === 0 && selectedStateMachine && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MousePointer className="w-5 h-5" />
                    State Machine Inputs (Fallback)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Inputs detected but not displaying properly. Here's a test input:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={false}
                          onCheckedChange={(checked) => {
                            console.log("Fallback MouseRelease toggled:", checked);
                            // Try to update the actual input
                            if (rive && selectedStateMachine) {
                              const inputs = rive.stateMachineInputs(selectedStateMachine);
                              const input = inputs.find(i => i.name === "MouseRelease");
                              if (input) {
                                input.value = checked;
                                console.log("Updated MouseRelease input to:", checked);
                              }
                            }
                          }}
                        />
                        <span className="font-medium">MouseRelease (Fallback)</span>
                      </div>
                      <Badge variant="outline">Boolean</Badge>
                      <span className="text-sm text-gray-500">False</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Refresh Button */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Debug Controls</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={refreshInputs}
                    variant="outline"
                    size="sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Refresh Inputs
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Current state machine inputs:", stateMachineInputs);
                      console.log("Current input values:", inputValues);
                      console.log("Selected state machine:", selectedStateMachine);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Log State
                  </Button>
                </div>
              </div>

              {/* MouseRelease Toggle Control */}
              {selectedStateMachine && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MousePointer className="w-5 h-5" />
                    MouseRelease
                  </h3>
                  <div className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={!!inputValues.MouseRelease}
                        onCheckedChange={(checked) => {
                          if (rive && selectedStateMachine) {
                            const inputs = rive.stateMachineInputs(selectedStateMachine);
                            const input = inputs.find(i => i.name === "MouseRelease");
                            if (input) {
                              input.value = checked;
                              setInputValues(prev => ({ ...prev, MouseRelease: checked }));
                              console.log("Set MouseRelease to", checked);
                            }
                          }
                        }}
                      />
                      <span className="font-medium">{inputValues.MouseRelease ? 'True' : 'False'}</span>
                    </div>
                    <Badge variant="outline">Boolean</Badge>
                  </div>
                </div>
              )}

              {/* Debug Info */}
              <div className="text-sm text-gray-500 space-y-1 p-3 bg-gray-50 rounded-lg">
                <div>Animations: {animations.length}</div>
                <div>State Machines: {stateMachines.length}</div>
                <div>Inputs: {stateMachineInputs.length}</div>
                <div>Selected State Machine: {selectedStateMachine || 'None'}</div>
                <div>Input Values: {JSON.stringify(inputValues)}</div>
                <div>State Machine Inputs: {JSON.stringify(stateMachineInputs.map(i => ({ name: i.name, type: i.type })))}</div>
                <div className="mt-2 p-2 bg-white rounded border">
                  <strong>Raw State Machine Inputs:</strong>
                  <pre className="text-xs mt-1 overflow-auto">
                    {JSON.stringify(stateMachineInputs, null, 2)}
                  </pre>
                </div>
                <div className="mt-2 p-2 bg-white rounded border">
                  <strong>Raw Input Values:</strong>
                  <pre className="text-xs mt-1 overflow-auto">
                    {JSON.stringify(inputValues, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
      </div>
    </div>
  );
};

export default RiveTester; 