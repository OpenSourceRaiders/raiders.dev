import React, { useState } from "react"
import JoinRoom from "../JoinRoom"
import InGameRoom from "../InGameRoom"
import backgroundImg from "../App/background.jpg"
import glowPatternImg from "../App/glow.png"
import { Arwes } from "arwes"

export const Router = () => {
  const [route, setRoute] = useState("room")
  const [loading, setLoading] = useState(false)

  const navigate = async (route) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRoute(route)
    setLoading(false)
  }

  return (
    <Arwes
      show={!loading}
      animate
      background={backgroundImg}
      pattern={glowPatternImg}
    >
      {route === "join" && <JoinRoom onNavigate={navigate} />}
      {route === "room" && <InGameRoom onNavigate={navigate} />}
    </Arwes>
  )
}

export default Router
