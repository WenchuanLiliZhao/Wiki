"use client";
import { useState, useEffect } from "react";

// ZoomSlider component for non-linear zoom control
interface ZoomSliderProps {
  scale: number;
  onZoomChange: (scale: number) => void;
}
export function ZoomSlider({ scale, onZoomChange }: ZoomSliderProps) {
  const [sliderValue, setSliderValue] = useState(50); // Default value (0-100)


  // Convert current scale to slider value when scale changes externally (e.g., wheel zoom)
  useEffect(() => {
    // Only update if significantly different to prevent loops
    const calculatedSliderValue = calculateSliderFromScale(scale);
    if (Math.abs(calculatedSliderValue - sliderValue) > 1) {
      setSliderValue(calculatedSliderValue);
    }
  }, [scale]);

  // Non-linear zoom scaling function - maps slider value (0-100) to actual scale (0.1-3)
  const calculateZoomScale = (sliderValue: number): number => {
    // Using a mapping that ensures 1.0 is the "true size"
    // Slider value 50 should map exactly to scale 1.0
    const minScale = 0.1;
    const maxScale = 3;
    
    // When slider is at 50, return exactly 1.0 (true size)
    if (sliderValue === 50) return 1.0;
    
    // Below 50: map 0-50 to 0.1-1.0 range (more gradual)
    if (sliderValue < 50) {
      return minScale + (1.0 - minScale) * (sliderValue / 50);
    }
    
    // Above 50: map 50-100 to 1.0-3.0 range (more rapid)
    return 1.0 + (maxScale - 1.0) * ((sliderValue - 50) / 50);
  };

  // Reverse mapping: calculate slider value from scale
  const calculateSliderFromScale = (scale: number): number => {
    const minScale = 0.1;
    const maxScale = 3;
    
    // Handle the exact 1.0 case
    if (scale === 1.0) return 50;
    
    // Below 1.0: map 0.1-1.0 to 0-50 range
    if (scale < 1.0) {
      return ((scale - minScale) / (1.0 - minScale)) * 50;
    }
    
    // Above 1.0: map 1.0-3.0 to 50-100 range
    return 50 + ((scale - 1.0) / (maxScale - 1.0)) * 50;
  };

  // Handle slider change
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    onZoomChange(calculateZoomScale(value));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label htmlFor="zoom">缩放比例: {scale.toFixed(2)}x</label>
      <input
        id="zoom"
        type="range"
        min="0"
        max="100"
        step="1"
        value={sliderValue}
        onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
        style={{ width: "100px" }} />
    </div>
  );
}
