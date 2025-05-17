import React from "react"
import { ContentShape } from "./_interface"

export const ContentUI_Art:React.FC<ContentShape> = ({ title, update, cover, content }) => {
  return (
    <div>
      <div>{title}</div>
      <div>{update}</div>
      <div>{cover}</div>
      <div>{content}</div>
    </div>
  )
}