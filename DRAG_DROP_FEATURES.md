# Rive ArtBoard Drag & Drop Features

## Overview
The Rive Asset Tester now includes interactive drag and drop functionality for the ArtBoard preview, allowing users to explore and manipulate Rive animations with intuitive controls.

## Features

### 🖱️ Mouse Controls
- **Drag to Move**: Click and drag anywhere on the ArtBoard to pan around
- **Scroll to Zoom**: Use mouse wheel to zoom in/out (10% increments)
- **Double-click to Reset**: Double-click anywhere on the canvas to reset view to center and 100% zoom

### 📱 Touch Controls (Mobile Support)
- **Touch Drag**: Single finger drag to move the ArtBoard
- **Pinch to Zoom**: Two-finger pinch gestures for zooming (future enhancement)

### 🎛️ Control Buttons
Located in the top-right corner of the preview area:
- **Reset View** (🔄): Resets position to center and zoom to 100%
- **Zoom In** (➕): Increases zoom by 10%
- **Zoom Out** (➖): Decreases zoom by 10%

### 📊 Visual Indicators
- **Zoom Level**: Shows current zoom percentage in bottom-right corner
- **Instructions**: Displays control hints in bottom-left corner
- **Cursor Changes**: Cursor changes to indicate draggable state

## Technical Implementation

### State Management
```typescript
const [isDragging, setIsDragging] = useState(false);
const [position, setPosition] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
```

### Transform Application
The Rive component is wrapped in a transform container:
```typescript
style={{
  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
  transformOrigin: 'center center',
  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
}}
```

### Event Handlers
- `handleMouseDown/MouseMove/MouseUp`: Desktop drag functionality
- `handleTouchStart/TouchMove/TouchEnd`: Mobile touch support
- `handleWheel`: Zoom functionality
- `handleDoubleClick`: Quick reset

## Usage Instructions

1. **Upload a Rive file** using the file upload component
2. **Drag the ArtBoard** by clicking and dragging anywhere on the preview
3. **Zoom in/out** using the mouse wheel or control buttons
4. **Reset the view** by double-clicking or using the reset button
5. **Use touch controls** on mobile devices for the same functionality

## Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes
- Smooth 60fps dragging with CSS transforms
- Hardware acceleration enabled
- Touch events optimized for mobile performance
- Zoom limits: 10% minimum, 300% maximum

## Future Enhancements
- Pinch-to-zoom gesture support
- Keyboard shortcuts (arrow keys for panning, +/- for zoom)
- Zoom to fit button
- Pan boundaries to prevent moving too far from content
- Zoom to specific point (mouse position) 