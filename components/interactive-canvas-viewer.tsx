"use client"

import { useEffect, useRef, useState } from "react"

interface CanvasNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: string
  text?: string
  color?: string
  label?: string
  file?: string
}

interface CanvasEdge {
  id: string
  fromNode: string
  fromSide: string
  toNode: string
  toSide: string
}

interface CanvasData {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

interface Transform {
  scale: number
  translateX: number
  translateY: number
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
  }
  
  let appliedColor = colors["0"]
  
  if (color && color.length === 1) {
    appliedColor = colors[color]
  } else if (color && color.length > 1) {
    appliedColor = color
  }
  
  return appliedColor
}

export function InteractiveCanvasViewer({ content }: { content: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null)
  const [viewBox, setViewBox] = useState("0 0 1000 1000")
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  // Parse canvas data
  useEffect(() => {
    try {
      const data = JSON.parse(content) as CanvasData
      setCanvasData(data)
      
      // Calculate viewBox
      if (data.nodes && data.nodes.length > 0) {
        let minX = Infinity
        let minY = Infinity
        let maxX = -Infinity
        let maxY = -Infinity
        
        data.nodes.forEach(node => {
          minX = Math.min(minX, node.x)
          minY = Math.min(minY, node.y)
          maxX = Math.max(maxX, node.x + node.width)
          maxY = Math.max(maxY, node.y + node.height)
        })
        
        const padding = 50
        setViewBox(`${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`)
      }
    } catch (error) {
      console.error("Failed to parse canvas data:", error)
    }
  }, [content])
  
  // Add non-passive wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const scaleFactor = delta > 0 ? 0.9 : 1.1;
      
      setTransform(prev => ({
        ...prev,
        scale: Math.max(0.1, Math.min(3, prev.scale * scaleFactor))
      }));
    };
    
    container.addEventListener('wheel', wheelHandler, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, []);
  
  // Handle zoom - keep this as a reference but we won't use it directly
  const handleWheel = (e: React.WheelEvent) => {
    // We're now handling this with the non-passive event listener above
  }
  
  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      
      setTransform(prev => ({
        ...prev,
        translateX: prev.translateX + dx,
        translateY: prev.translateY + dy
      }))
      
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }
  
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  // Handle reset view
  const resetView = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 })
  }
  
  if (!canvasData) {
    return <div>Loading canvas...</div>
  }
  
  // Calculate edge positions
  const edgesWithPosition = canvasData.edges.map(edge => {
    const fromNode = canvasData.nodes.find(node => node.id === edge.fromNode)
    const toNode = canvasData.nodes.find(node => node.id === edge.toNode)
    
    if (!fromNode || !toNode) return null
    
    let fromX = 0, fromY = 0, toX = 0, toY = 0
    
    // Calculate start position
    if (edge.fromSide === "right") {
      fromX = fromNode.x + fromNode.width
      fromY = fromNode.y + fromNode.height / 2
    } else if (edge.fromSide === "bottom") {
      fromX = fromNode.x + fromNode.width / 2
      fromY = fromNode.y + fromNode.height
    } else if (edge.fromSide === "left") {
      fromX = fromNode.x
      fromY = fromNode.y + fromNode.height / 2
    } else if (edge.fromSide === "top") {
      fromX = fromNode.x + fromNode.width / 2
      fromY = fromNode.y
    }
    
    // Calculate end position
    if (edge.toSide === "right") {
      toX = toNode.x + toNode.width
      toY = toNode.y + toNode.height / 2
    } else if (edge.toSide === "bottom") {
      toX = toNode.x + toNode.width / 2
      toY = toNode.y + toNode.height
    } else if (edge.toSide === "left") {
      toX = toNode.x
      toY = toNode.y + toNode.height / 2
    } else if (edge.toSide === "top") {
      toX = toNode.x + toNode.width / 2
      toY = toNode.y
    }
    
    return { ...edge, fromX, fromY, toX, toY }
  }).filter(Boolean) as (CanvasEdge & { fromX: number, fromY: number, toX: number, toY: number })[]

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
            cursor: "pointer"
          }}
        >
          Reset View
        </button>
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
          cursor: isDragging ? "grabbing" : "grab"
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
            transformOrigin: "center"
          }}
        >
          {/* Render groups first */}
          {canvasData.nodes
            .filter(node => node.type === "group")
            .map(node => (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx="15"
                  stroke={mapColor(node.color)}
                  strokeWidth="2"
                  fill="#fbfbfb20"
                />
                {node.label && (
                  <text
                    x={node.x + 15}
                    y={node.y - 10}
                    fontFamily="system-ui, sans-serif"
                    fontSize="16"
                    fontWeight="bold"
                    fill="#2c2d2c"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            ))}
            
          {/* Render edges with arrow markers */}
          <defs>
            {edgesWithPosition.map(edge => (
              <marker
                key={`marker-${edge.id}`}
                id={`arrow-${edge.id}`}
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#7e7e7e" />
              </marker>
            ))}
          </defs>
          
          {edgesWithPosition.map(edge => (
            <line
              key={edge.id}
              x1={edge.fromX}
              y1={edge.fromY}
              x2={edge.toX}
              y2={edge.toY}
              stroke="#7e7e7e"
              strokeWidth="2"
              markerEnd={`url(#arrow-${edge.id})`}
            />
          ))}
          
          {/* Render nodes */}
          {canvasData.nodes
            .filter(node => node.type !== "group")
            .map(node => (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx="5"
                  stroke={mapColor(node.color)}
                  strokeWidth="2"
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
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "14px",
                        overflow: "hidden",
                        wordWrap: "break-word"
                      }}
                    >
                      {node.text.split("$").map((part, i) => 
                        i % 2 === 0 ? 
                          part : <em key={i} style={{fontStyle: "italic"}}>{part}</em>
                      )}
                    </div>
                  </foreignObject>
                )}
              </g>
            ))}
        </svg>
      </div>
    </div>
  )
} 