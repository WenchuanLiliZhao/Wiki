"use client"

import { useEffect, useRef, useState } from "react"
import path from "path"

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

interface CanvasNodeWithTitle extends CanvasNode {
  pageTitle?: string
}

interface CanvasData {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

interface CanvasDataWithTitles {
  nodes: CanvasNodeWithTitle[]
  edges: CanvasEdge[]
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

export function CanvasViewer({ content }: { content: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [canvasData, setCanvasData] = useState<CanvasDataWithTitles | null>(null)
  const [viewBox, setViewBox] = useState("0 0 1000 1000")
  
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
    <div className="canvas-viewer">
      <svg 
        ref={svgRef} 
        viewBox={viewBox} 
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", minHeight: "400px" }}
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
              {node.type === "file" && node.file ? (
                <a 
                  href={`/wiki/${node.file.replace(/\.md$/, "")}`}
                  target="_self"
                >
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
                  <foreignObject
                    x={node.x + 10}
                    y={node.y + 10}
                    width={node.width - 20}
                    height={node.height - 20}
                  >
                    <div 
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "16px",
                        overflow: "hidden",
                        wordWrap: "break-word",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100%"
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                        {node.pageTitle || path.basename(node.file.replace(/\.md$/, ""))}
                      </div>
                      <div style={{ fontSize: "14px", opacity: 0.8 }}>
                        {node.file}
                      </div>
                    </div>
                  </foreignObject>
                </a>
              ) : (
                <>
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
                </>
              )}
            </g>
          ))}
      </svg>
    </div>
  )
} 