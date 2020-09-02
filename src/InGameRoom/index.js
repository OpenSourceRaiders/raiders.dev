import React, { useState } from "react"
import { styled } from "@material-ui/styles"
import { Project, Words, Button, Loading, Heading, Link, Row, Col } from "arwes"
import CenteredContent from "../CenteredContent"
import ReactTwitchEmbedVideo from "react-twitch-embed-video"
import useSessionPolling from "../hooks/use-session-polling"
import Grid from "@material-ui/core/Grid"
import TextInput from "../TextInput"
import CommandTerminal from "../CommandTerminal"
import useRunRoom from "../hooks/use-run-room"
import speech from "../speech"

const IFrame = styled("iframe")({
  border: "none",
  transition: "opacity 100ms",
  "&.loading": {
    opacity: 0,
  },
})
const Spacing = styled("div")({ "& > *": { margin: 8 } })
const toMinSecs = (n) => {
  const minutes = Math.floor(n / 60)
  const seconds = n % 60
  return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`
}

export const InGameRoom = ({ session_id }) => {
  const [loading, setLoading] = useState(false)
  const [bigCamera, setBigCamera] = useState(false)
  const [timeUntilScreenOnYou, setTimeUntilScreenOnYou] = useState("1:43")
  const [playerNumber, setPlayerNumber] = useState(null)
  const [session, changeSession] = useSessionPolling(session_id)
  useRunRoom(session)
  const fakeLoad = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(false)
  }
  const [showing, setShowing] = useState([
    // "playerNumber",
    "camera",
    "screen",
    "status",
    "stream",
  ])
  const playerNumberSelected = async (e) => {
    const number = parseInt(e.target.innerHTML)
    setPlayerNumber(number)
    speech.speak({ text: "Welcome... Raider " + number })
    await fakeLoad()
    setShowing(["camera"])
  }
  const inStream = showing.includes("stream")
  return (
    <CenteredContent page>
      <Grid container>
        <Grid xs={!inStream ? 12 : 7}>
          {!showing.includes("playerNumber") && (
            <Project
              style={{ marginTop: 32, width: !inStream ? 450 : undefined }}
              show={!loading && showing.includes("camera")}
              animate
              header="Add Camera and Join Chat"
            >
              {showing.includes("camera") && !inStream && (
                <Words animate show={!loading}>
                  You'll be able to talk to other people in the stream after you
                  connect.
                </Words>
              )}
              <IFrame
                src="https://obs.ninja/?room=lamebear_cam&webcam"
                width={!inStream ? 400 : 600}
                allow="camera;microphone"
                title="camera"
                className={
                  loading || !showing.includes("camera") ? "loading" : ""
                }
                height={bigCamera ? 400 : 240}
              ></IFrame>
              {showing.includes("camera") && (
                <div style={{ textAlign: "right" }}>
                  {showing.includes("screen") && (
                    <Button onClick={() => setBigCamera(!bigCamera)}>
                      {bigCamera ? "Make Smaller" : "Make Bigger"}
                    </Button>
                  )}
                  <Button
                    onClick={async () => {
                      await fakeLoad()
                      setShowing(["screen"])
                      setBigCamera(false)
                    }}
                  >
                    Camera Added
                  </Button>
                </div>
              )}
            </Project>
          )}
        </Grid>
        <Grid item xs={!inStream ? 12 : 5}>
          {showing.includes("playerNumber") && (
            <Project show={!loading} animate header="Select Your Player">
              {!loading && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button disabled animate>
                    1
                  </Button>
                  <Button disabled animate>
                    2
                  </Button>
                  <Button onClick={playerNumberSelected} animate>
                    3
                  </Button>
                  <Button animate>4</Button>
                </div>
              )}
            </Project>
          )}
          <div style={{ marginTop: 32 }} />
          <div style={{ textAlign: "center" }}>
            {showing.includes("screen") && (
              <Project
                show={!loading}
                animate
                header="Share Desktop"
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                }}
              >
                {!showing.includes("stream")
                  ? !loading && (
                      <div animate show={!loading}>
                        Don't share audio. Try to use an external or{" "}
                        <Link href="https://askubuntu.com/a/998435">
                          virtual monitor
                        </Link>{" "}
                        with 720p resolution. This is better than switching
                        between applications. Make sure your text is BIG in your
                        terminal and editor. Mute yourself by hitting the mic
                        (to save bandwidth) in this window.
                      </div>
                    )
                  : null}
                <div style={{ marginTop: 16 }}>
                  <IFrame
                    src="https://obs.ninja/?room=lamebear_screen&view&screenshare&noaudio&novideo"
                    width="300"
                    className={loading ? "loading" : ""}
                    height={240}
                  ></IFrame>
                </div>
                {!inStream && (
                  <div style={{ textAlign: "right" }}>
                    <Button
                      onClick={async () => {
                        await fakeLoad()
                        setShowing(["status", "stream", "camera", "screen"])
                      }}
                    >
                      Desktop Added
                    </Button>
                  </div>
                )}
              </Project>
            )}
          </div>
        </Grid>
        <Grid xs={12}>
          {inStream && (
            <>
              <Col s={12}>
                <Project
                  style={{ marginTop: 32 }}
                  header="Status"
                  animate
                  show={!loading}
                >
                  <Grid container>
                    <Grid item xs={8}>
                      <Heading>
                        Current Game: {session?.state_info?.currentTitle} {"(+"}
                        {toMinSecs(session?.state_info?.timeRemaining)})
                      </Heading>
                      <Heading>
                        Spotlight:{" "}
                        {
                          (session?.players || [])[
                            session?.state_info?.spotlight?.player
                          ]
                        }
                      </Heading>
                      <Spacing>
                        <Button
                          onClick={() => {
                            const id = Math.random().toString(36).slice(-8)
                            fetch(`/api/command`, {
                              method: "POST",
                              body: JSON.stringify({
                                command: {
                                  type: "SPOTLIGHT",
                                  player: playerNumber || 0,
                                  until:
                                    session?.state_info?.timeRemaining - 60,
                                  id,
                                },
                                session_id,
                                player_number: playerNumber || 0,
                              }),
                              headers: { "Content-Type": "application/json" },
                            })
                          }}
                        >
                          Steal Spotlight
                        </Button>
                        <Button>Leave</Button>
                      </Spacing>
                    </Grid>
                    <Grid item xs={4}>
                      <CommandTerminal
                        commands={session ? session.recentCommands : []}
                        onSubmit={(cmd) => {
                          const id = Math.random().toString(36).slice(-8)
                          fetch(`/api/command`, {
                            method: "POST",
                            body: JSON.stringify({
                              command: { ...cmd, id },
                              session_id,
                              player_number: playerNumber || 0,
                            }),
                            headers: { "Content-Type": "application/json" },
                          })
                        }}
                      />
                    </Grid>
                  </Grid>
                </Project>
                <Project
                  style={{ marginTop: 32 }}
                  header="Stream"
                  animate
                  show={!loading}
                >
                  <ReactTwitchEmbedVideo channel="opensourceraiders" />
                </Project>
                {window.localStorage.is_admin && (
                  <Project
                    style={{ marginTop: 32 }}
                    header="Admin"
                    animate
                    show={!loading}
                  >
                    <Spacing>
                      <Button>Kick 1</Button>
                      <Button>Kick 2</Button>
                      <Button>Kick 3</Button>
                      <Button>Kick 4</Button>
                    </Spacing>
                  </Project>
                )}
              </Col>
            </>
          )}
        </Grid>
      </Grid>
    </CenteredContent>
  )
}

export default InGameRoom

{
  /* <iframe
  src="https://obs.ninja/?room=lamebear&webcam&novideo"
  width="400"
  allow="camera;microphone"
  height="400"
></iframe>
<iframe
  src="https://obs.ninja/?room=lamebear&view&screenshare&noaudio&novideo"
  width="400"
  height="400"
></iframe> */
}
