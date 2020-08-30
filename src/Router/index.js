import React, { useState } from "react"
import JoinRoom from "../JoinRoom"
import InGameRoom from "../InGameRoom"
import SchedulePage from "../SchedulePage"
import backgroundImg from "../App/background.jpg"
import glowPatternImg from "../App/glow.png"
import { useAuth0 } from "@auth0/auth0-react"
import { Arwes } from "arwes"

export const Router = () => {
  const [route, setRoute] = useState("join")
  const [loading, setLoading] = useState(false)
  const { loginWithRedirect, logout } = useAuth0()

  const navigate = async (route) => {
    if (route === "login") {
      loginWithRedirect()
      return
    }
    if (route === "logout") {
      logout({ returnTo: window.location.origin })
      return
    }
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
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
      {route === "schedule" && <SchedulePage onNavigate={navigate} />}
    </Arwes>
  )
}

export default Router
