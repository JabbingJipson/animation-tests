# Rive Content Detection Test

## To test the content detection:

1. Upload any .riv file to the application
2. Open browser developer tools (F12)
3. Check the console for debug logs
4. Look for messages like:
   - "Rive instance available:"
   - "Extracting Rive content from:"
   - "Artboards:"
   - "Animations:"
   - "State machines:"

## Expected console output:
```
Rive instance available: [Rive object]
Extracting Rive content from: [Rive object]
Artboards: ["Main"]
Current artboard: [Artboard object]
Animations: [Array of animations]
State machines: [Array of state machines]
Inputs for State Machine 1: [Array of inputs]
Final Rive info: [Complete object]
```

## If you don't see this output:
- The Rive file might not be loading properly
- The Rive API might be different than expected
- There might be an error in the extraction logic

## Common issues:
- File not found (404 error)
- CORS issues with local files
- Rive file format compatibility
- Missing state machines or animations in the file 