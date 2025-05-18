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
    // Using exponential function for non-linear scaling
    // Lower slider values have smaller change rate, higher values have larger change rate
    const minScale = 0.1;
    const maxScale = 3;
    const normalizedValue = sliderValue / 100;

    // Exponential function: minScale * e^(ln(maxScale/minScale) * normalizedValue)
    return minScale * Math.exp(Math.log(maxScale / minScale) * normalizedValue);
  };

  // Reverse mapping: calculate slider value from scale
  const calculateSliderFromScale = (scale: number): number => {
    const minScale = 0.1;
    const maxScale = 3;

    // Bounded scale value
    const boundedScale = Math.max(minScale, Math.min(maxScale, scale));

    // Reverse of exponential function
    const normalizedValue = Math.log(boundedScale / minScale) / Math.log(maxScale / minScale);
    return normalizedValue * 100;
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
