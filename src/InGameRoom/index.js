import React, { useState } from "react"
import { styled } from "@material-ui/styles"
import { Project, Words, Button, Loading, Heading, Link, Row, Col } from "arwes"
import CenteredContent from "../CenteredContent"
import ReactTwitchEmbedVideo from "react-twitch-embed-video"

const IFrame = styled("iframe")({
  border: "none",
  transition: "opacity 100ms",
  "&.loading": {
    opacity: 0,
  },
})
const Spacing = styled("div")({ "& > *": { margin: 8 } })

export const InGameRoom = () => {
  const [loading, setLoading] = useState(false)
  const [bigCamera, setBigCamera] = useState(true)
  const [bigScreen, setBigScreen] = useState(true)
  const [currentGame, setCurrentGame] = useState("Deep Dive")
  const [timeRemaining, setTimeRemaining] = useState("15:03")
  const [timeUntilScreenOnYou, setTimeUntilScreenOnYou] = useState("1:43")
  const [playerNumber, setPlayerNumber] = useState(null)
  const fakeLoad = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(false)
  }
  const [showing, setShowing] = useState([
    "playerNumber",
    // "camera",
    // "screen",
    // "status",
    // "stream",
  ])
  const playerNumberSelected = async (e) => {
    const number = parseInt(e.target.innerHTML)
    setPlayerNumber(number)
    await fakeLoad()
    setShowing(["camera"])
  }
  const inStream = showing.includes("stream")
  return (
    <CenteredContent page style={inStream ? { minWidth: 1600 } : {}}>
      <Row>
        <Col s={inStream ? null : 12}>
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
          {showing.includes("camera") && (
            <Project
              style={{ marginTop: 32 }}
              show={!loading}
              animate
              header="Add Camera and Join Chat"
            >
              <IFrame
                src="https://obs.ninja/?room=lamebear&webcam&novideo"
                width="400"
                allow="camera;microphone"
                title="camera"
                className={loading ? "loading" : ""}
                height={bigCamera ? 300 : 50}
              ></IFrame>
              <div style={{ textAlign: "right" }}>
                {showing.includes("screen") && (
                  <Button onClick={() => setBigCamera(true)}>
                    Make Bigger
                  </Button>
                )}
                <Button
                  onClick={async () => {
                    await fakeLoad()
                    setShowing(showing.concat(["screen"]))
                    setBigCamera(false)
                  }}
                >
                  Camera Added
                </Button>
              </div>
            </Project>
          )}
          <div style={{ marginTop: 32 }} />
          {showing.includes("screen") && (
            <Project
              show={!loading}
              animate
              header="Share Desktop"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {!showing.includes("stream")
                ? !loading && (
                    <div animate show={!loading} style={{ maxWidth: 400 }}>
                      Don't share audio. Try to use an external or{" "}
                      <Link href="https://askubuntu.com/a/998435">
                        virtual monitor
                      </Link>{" "}
                      with 720p resolution. This is better than switching
                      between applications. Make sure your text is BIG in your
                      terminal and editor.
                    </div>
                  )
                : !loading && (
                    <div style={{ maxWidth: 400 }}>
                      You can change your application source by hitting the gear
                      icon below, then "Share Screen".
                    </div>
                  )}
              <div style={{ marginTop: 16 }}>
                <IFrame
                  src="https://obs.ninja/?room=lamebear&view&screenshare&noaudio&novideo"
                  width="400"
                  className={loading ? "loading" : ""}
                  height={bigScreen ? 400 : 100}
                ></IFrame>
              </div>
              <div style={{ textAlign: "right" }}>
                <Button
                  onClick={async () => {
                    await fakeLoad()
                    setShowing(showing.concat(["status", "stream"]))
                  }}
                >
                  Desktop Added
                </Button>
              </div>
            </Project>
          )}
        </Col>
        {inStream && (
          <Col>
            <Project
              style={{ marginTop: 32 }}
              header="Status"
              animate
              show={!loading}
            >
              <Heading>
                Current Game: {currentGame} (+{timeRemaining})
              </Heading>
              <Heading>Screen is on: seve</Heading>
              <Heading>Screen on you in: {timeUntilScreenOnYou}</Heading>
              <Spacing>
                <Button>Steal Screen</Button>
                <Button>Leave</Button>
              </Spacing>
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
                  <Button>Start Deep Dive</Button>
                  <Button>Start Quick Find</Button>
                  <Button>Start Help Wanted</Button>
                  <Button>Kick 1</Button>
                  <Button>Kick 2</Button>
                  <Button>Kick 3</Button>
                  <Button>Kick 4</Button>
                </Spacing>
              </Project>
            )}
          </Col>
        )}
      </Row>
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
