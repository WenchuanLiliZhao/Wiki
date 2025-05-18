"use client";

import { useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { ZoomSlider } from "./ZoomSlider";

interface CanvasNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  text?: string;
  color?: string;
  label?: string;
  file?: string;
}

interface CanvasEdge {
  id: string;
  fromNode: string;
  fromSide: string;
  toNode: string;
  toSide: string;
  label?: string;
}

interface CanvasData {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

function mapColor(color: string | undefined) {
  const colors: Record<string, string> = {
    "0": "#7e7e7e",
    "1": "#aa363d",
    "2": "#a56c3a",
    "3": "#aba960",
    "4": "#199e5c",
    "5": "#249391",
    "6": "#795fac",
  };

  let appliedColor = colors["0"];

  if (color && color.length === 1) {
    appliedColor = colors[color];
  } else if (color && color.length > 1) {
    appliedColor = color;
  }

  return appliedColor;
}

// Parse and render KaTeX formulas
function renderMathInText(text: string) {
  if (!text.includes("$")) return text;

  const parts = text.split(/(\$+)/).filter(Boolean);
  const result: React.ReactNode[] = [];
  let inMath = false;

  parts.forEach((part, index) => {
    if (part.startsWith("$")) {
      inMath = !inMath;
      // Skip the dollar sign markers
      return;
    }

    if (inMath) {
      // This is a math part, render with KaTeX
      const html = katex.renderToString(part, {
        throwOnError: false,
        displayMode: false,
        macros: {
          "\\Tuple": "{\\left\\langle #1 \\right\\rangle}",
          "\\String": "{\\text{`} #1 \\text{'}}",
          "\\Numeral": "{\\tilde{#1}}",
          "\\StringAdd": "{^{\\frown}}",
        },
      });

      result.push(
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: html }}
          className="math"
        />
      );
    } else {
      // This is a text part
      result.push(<span key={index}>{part}</span>);
    }
  });

  return result;
}

export function InteractiveCanvasViewer({ content }: { content: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const [viewBox, setViewBox] = useState("0 0 1000 1000");
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [curviness, setCurviness] = useState(1); // Control the curve intensity (0.1 to 1.0)

  // Handle zoom change from slider
  const handleZoomChange = (newScale: number) => {
    setTransform(prev => ({
      ...prev,
      scale: newScale
    }));
  };

  // Parse canvas data
  useEffect(() => {
    try {
      const data = JSON.parse(content) as CanvasData;
      setCanvasData(data);

      // Calculate viewBox
      if (data.nodes && data.nodes.length > 0) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        data.nodes.forEach((node) => {
          minX = Math.min(minX, node.x);
          minY = Math.min(minY, node.y);
          maxX = Math.max(maxX, node.x + node.width);
          maxY = Math.max(maxY, node.y + node.height);
        });

        const padding = 50;
        setViewBox(
          `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${
            maxY - minY + padding * 2
          }`
        );
      }
    } catch (error) {
      console.error("Failed to parse canvas data:", error);
    }
  }, [content]);

  // Add non-passive wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const scaleFactor = delta > 0 ? 0.9 : 1.1;

      setTransform((prev) => ({
        ...prev,
        scale: Math.max(0.1, Math.min(3, prev.scale * scaleFactor)),
      }));
    };

    container.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      container.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      setTransform((prev) => ({
        ...prev,
        translateX: prev.translateX + dx,
        translateY: prev.translateY + dy,
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle reset view
  const resetView = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  if (!canvasData) {
    return <div>Loading canvas...</div>;
  }

  // Calculate edge positions
  const edgesWithPosition = canvasData.edges
    .map((edge) => {
      const fromNode = canvasData.nodes.find(
        (node) => node.id === edge.fromNode
      );
      const toNode = canvasData.nodes.find((node) => node.id === edge.toNode);

      if (!fromNode || !toNode) return null;

      let fromX = 0,
        fromY = 0,
        toX = 0,
        toY = 0;

      // Calculate start position
      if (edge.fromSide === "right") {
        fromX = fromNode.x + fromNode.width;
        fromY = fromNode.y + fromNode.height / 2;
      } else if (edge.fromSide === "bottom") {
        fromX = fromNode.x + fromNode.width / 2;
        fromY = fromNode.y + fromNode.height;
      } else if (edge.fromSide === "left") {
        fromX = fromNode.x;
        fromY = fromNode.y + fromNode.height / 2;
      } else if (edge.fromSide === "top") {
        fromX = fromNode.x + fromNode.width / 2;
        fromY = fromNode.y;
      }

      // Calculate end position
      if (edge.toSide === "right") {
        toX = toNode.x + toNode.width;
        toY = toNode.y + toNode.height / 2;
      } else if (edge.toSide === "bottom") {
        toX = toNode.x + toNode.width / 2;
        toY = toNode.y + toNode.height;
      } else if (edge.toSide === "left") {
        toX = toNode.x;
        toY = toNode.y + toNode.height / 2;
      } else if (edge.toSide === "top") {
        toX = toNode.x + toNode.width / 2;
        toY = toNode.y;
      }

      // ======================================
      // Calculate control points for S-curve
      const dx = Math.abs(toX - fromX);
      const dy = Math.abs(toY - fromY);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const curveFactor = Math.min(200, distance * curviness);

      let cx1 = fromX,
        cy1 = fromY,
        cx2 = toX,
        cy2 = toY;

      // Set control points based on the direction
      if (edge.fromSide === "right") cx1 = fromX + curveFactor;
      else if (edge.fromSide === "left") cx1 = fromX - curveFactor;
      else if (edge.fromSide === "bottom") cy1 = fromY + curveFactor;
      else if (edge.fromSide === "top") cy1 = fromY - curveFactor;

      if (edge.toSide === "right") cx2 = toX + curveFactor;
      else if (edge.toSide === "left") cx2 = toX - curveFactor;
      else if (edge.toSide === "bottom") cy2 = toY + curveFactor;
      else if (edge.toSide === "top") cy2 = toY - curveFactor;

      return { ...edge, fromX, fromY, toX, toY, cx1, cy1, cx2, cy2 };
    })
    .filter(Boolean) as (CanvasEdge & {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    cx1: number;
    cy1: number;
    cx2: number;
    cy2: number;
  })[];
  // ======================================

  return (
    <div className="canvas-viewer-container" ref={containerRef}>
      <div className="canvas-controls">
        <button
          onClick={resetView}
          className="reset-button"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
            padding: "5px 10px",
            background: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset View
        </button>

        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "10px",
            zIndex: 10,
            padding: "10px",
            background: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <label htmlFor="curviness">连线曲度: {curviness.toFixed(1)}</label>
          <input
            id="curviness"
            type="range"
            min="0.5"
            max="1"
            step="0.1"
            value={curviness}
            onChange={(e) => setCurviness(parseFloat(e.target.value))}
            style={{ width: "100px" }}
          />

          <ZoomSlider scale={transform.scale} onZoomChange={handleZoomChange} />
        </div>
      </div>

      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          overflow: "hidden",
          width: "100%",
          height: "600px",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <svg
          ref={svgRef}
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`,
            transformOrigin: "center",
          }}
        >
          {/* Render groups first */}
          {canvasData.nodes
            .filter((node) => node.type === "group")
            .map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx="8"
                  stroke={mapColor(node.color)}
                  strokeWidth="1"
                  fill="#fbfbfb20"
                />
                {node.label && (
                  <text
                    x={node.x + 0}
                    y={node.y - 10}
                    className="group-label"
                    fill="#2c2d2c"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            ))}

          {/* Render edges with arrow markers */}
          <defs>
            {edgesWithPosition.map((edge) => (
              <marker
                key={`marker-${edge.id}`}
                id={`arrow-${edge.id}`}
                viewBox="0 0 10 10"
                refX="10" // Position the arrow tip exactly at the end of the path
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#7e7e7e" />
              </marker>
            ))}
          </defs>

          {edgesWithPosition.map((edge) => {
            // Adjust endpoint coordinates to ensure arrows connect precisely at card edges
            // This compensates for the marker dimensions and creates a seamless visual connection
            const endX = edge.toSide === "left" ? edge.toX + 1 : 
                         edge.toSide === "right" ? edge.toX - 1 : edge.toX;
            const endY = edge.toSide === "top" ? edge.toY + 1 : 
                         edge.toSide === "bottom" ? edge.toY - 1 : edge.toY;
                         
            // Calculate the exact midpoint on the cubic Bezier curve (at t=0.5)
            // Using the formula: P(0.5) = 0.125*P0 + 0.375*P1 + 0.375*P2 + 0.125*P3
            const midX = 0.125 * edge.fromX + 0.375 * edge.cx1 + 0.375 * edge.cx2 + 0.125 * endX;
            const midY = 0.125 * edge.fromY + 0.375 * edge.cy1 + 0.375 * edge.cy2 + 0.125 * endY;
            
            return (
              <g key={edge.id} >
                <path
                  d={`M ${edge.fromX} ${edge.fromY} C ${edge.cx1} ${edge.cy1}, ${edge.cx2} ${edge.cy2}, ${endX} ${endY}`}
                  fill="none"
                  stroke="#7e7e7e"
                  strokeWidth="1"
                  markerEnd={`url(#arrow-${edge.id})`} // Attach arrow marker to the path end
                />
                {edge.label && (
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#555"
                    fontSize="14"
                    paintOrder="stroke"
                    strokeWidth="4"
                    stroke="#ffffff"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render nodes */}
          {canvasData.nodes
            .filter((node) => node.type !== "group")
            .map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx="4"
                  stroke={mapColor(node.color)}
                  strokeWidth="1"
                  fill="white"
                  fillOpacity="0.9"
                />

                {node.text && (
                  <foreignObject
                    x={node.x + 10}
                    y={node.y + 5}
                    width={node.width - 20}
                    height={node.height - 10}
                  >
                    <div
                      className="node-content"
                      style={{
                        overflow: "hidden",
                        wordWrap: "break-word",
                      }}
                    >
                      {renderMathInText(node.text)}
                    </div>
                  </foreignObject>
                )}
              </g>
            ))}
        </svg>
      </div>
    </div>
  );
}
