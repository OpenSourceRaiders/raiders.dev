import React, { useState } from "react"
import CenteredContent from "../CenteredContent"
import { Project, Words, Button, Loading, Heading } from "arwes"
import TextInput from "../TextInput"

export const JoinRoom = ({ show, onNavigate }) => {
  const [roomCode, setRoomCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [errorText, setErrorText] = useState("")
  return (
    <CenteredContent page>
      <Project show={!loading} header="Welcome Raider" animate>
        <Words animate show={!loading}>
          Enter the room code below to begin.
        </Words>
        {errorText && (
          <div>
            <Words layer="alert" animate show={!loading && errorText}>
              {errorText}
            </Words>
          </div>
        )}
        <div>
          <TextInput
            show={!loading}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Room Code"
          />
          {!loading && (
            <Button
              show={roomCode && !loading}
              animate
              disabled={!roomCode}
              onClick={async () => {
                setLoading(true)
                setLoadingText("Finding Room...")
                await new Promise((resolve) => setTimeout(resolve, 2000))
                if (roomCode.toLowerCase() === "raids") {
                  onNavigate("room")
                } else {
                  setErrorText("Room not found")
                  setLoading(false)
                }
              }}
              style={{ marginLeft: 24 }}
            >
              Submerge
            </Button>
          )}
        </div>
      </Project>
      {loading && (
        <div style={{ marginTop: -30 }}>
          <Loading animate full show={loading} />
          <Heading layer="alert" node="h1">
            {loadingText}
          </Heading>
        </div>
      )}
      <div style={{ position: "absolute", right: 10, bottom: 10 }}>
        <Button
          onClick={() => {
            setLoading(true)
            if (window.localStorage.is_asshole) {
              setLoadingText("Too bad asshole!")
              setTimeout(() => {
                setLoading(false)
              }, 2000)
            } else {
              setLoadingText("Fixing design...")
              setTimeout(() => {
                window.localStorage.is_asshole = "true"
                window.location.reload()
              }, 3000)
            }
          }}
          layer="alert"
        >
          {!window.localStorage.is_asshole
            ? "I don't like this design"
            : "I actually did like the old design!"}
        </Button>
      </div>
    </CenteredContent>
  )
}

export default JoinRoom
