import React, { useState } from "react"
import CenteredContent from "../CenteredContent"
import { styled } from "@material-ui/styles"
import { Project, Words, Button, Loading, Heading, Table, Link } from "arwes"
import { Arwes } from "arwes"
import moment from "moment"
import CountTo from "../CountTo"
import Backdrop from "@material-ui/core/Backdrop"
import { useAuth0 } from "@auth0/auth0-react"

const gameDefs = {
  "All In": {
    description:
      "In All In, all players work towards the completion of a single challenging issue.",
    duration: 30 * 60 * 1000,
  },
  Ambush: {
    description:
      "In Ambush, each player selects an issue on the same repository. If a player finishes early, they can help another player complete their issue. To complete an ambush, every player must submit a PR that plausibly fixes an issue. The players lose the Ambush after 30 minutes if they haven't all created PRs.",
    duration: 30 * 60 * 1000,
  },
  "Help Wanted": {
    description:
      "In Help Wanted, the players spend the first 5 minutes finding a Github issue with Help Wanted on it. After selecting their issue, the players spend 15 minutes creating a pull request to try to fix that issue. The players lose if they don't submit a PR in less than 15 minutes.",
    duration: 20 * 60 * 1000,
  },
}

const TableItem = styled("div")({
  padding: 8,
})

const ButtonContainer = styled("div")({
  position: "absolute",
  right: 10,
  bottom: 10,
  "& > *": {
    margin: 8,
  },
})

export const SchedulePage = ({ onNavigate }) => {
  const [infoDialog, setInfoDialog] = useState({ open: false })
  const { user, isAuthenticated } = useAuth0()
  const sessions = [
    {
      startsAt: moment().add(48, "minutes"),
      theme: "NPM Packages",
      slotsTotal: 3,
      slotsFilled: 1,
      games: [
        {
          gameName: "Ambush",
          repo: "https://github.com/UniversalDataTool/universal-data-tool",
        },
        {
          gameName: "Help Wanted",
          times: 2,
        },
      ],
    },
    {
      startsAt: moment().add(3495, "minutes"),
      theme: "Elixir",
      slotsTotal: 3,
      slotsFilled: 2,
      playerIn: true,
      games: [
        {
          gameName: "Ambush",
          repo: "https://github.com/UniversalDataTool/universal-data-tool",
        },
        {
          gameName: "Help Wanted",
          times: 2,
        },
      ],
    },
    {
      startsAt: moment().add(39, "hours").add(21, "minutes"),
      theme: "PIP Packages",
      slotsTotal: 3,
      slotsFilled: 3,
      games: [
        {
          gameName: "Ambush",
          repo: "https://github.com/UniversalDataTool/universal-data-tool",
        },
        {
          gameName: "Help Wanted",
          times: 2,
        },
      ],
    },
  ]

  return (
    <CenteredContent page>
      <Project animate header="Schedule" show={!infoDialog.open}>
        <Table
          show={!infoDialog.open}
          animate
          headers={["Starts In", "Date", "Time", "Theme", "Games", ""]}
          dataset={sessions.map((session) =>
            [
              <CountTo to={session.startsAt} />,
              moment(session.startsAt).format("ddd MMM Do"),
              moment(session.startsAt).format("LT"),
              session.theme,
              <div>
                {session.games.map((game, i) => (
                  <Link
                    style={{ display: "block" }}
                    onClick={() => {
                      setInfoDialog({
                        title: game.gameName,
                        content:
                          gameDefs[game.gameName].description +
                          "\n\n" +
                          (game.repo
                            ? `The repo selected for this session is: ${game.repo}`
                            : ""),
                        open: true,
                      })
                    }}
                  >
                    {moment(gameDefs[game.gameName].duration).minutes() *
                      (game.times || 1)}
                    m {game.gameName}{" "}
                    {game.times && game.times !== 1 ? `(${game.times}x)` : ""}
                  </Link>
                ))}
              </div>,
              <div style={{ margin: 8, textAlign: "center" }}>
                {session.playerIn ? (
                  <Button layer="success">
                    Joined ({session.slotsFilled}/{session.slotsTotal})
                  </Button>
                ) : session.slotsFilled < session.slotsTotal ? (
                  <Button>
                    Join ({session.slotsFilled}/{session.slotsTotal})
                  </Button>
                ) : (
                  <Button disabled>
                    Full ({session.slotsTotal}/{session.slotsTotal})
                  </Button>
                )}
              </div>,
            ].map((item, i) => <TableItem key={i}>{item}</TableItem>)
          )}
        />
      </Project>
      <Backdrop
        open={infoDialog.open}
        onClick={() => setInfoDialog({ ...infoDialog, open: false })}
        style={{ zIndex: 100 }}
      >
        <CenteredContent page>
          <Project header={infoDialog.title} animate show>
            <Words style={{ whiteSpace: "pre-wrap" }} animate show>
              {infoDialog.content}
            </Words>
          </Project>
        </CenteredContent>
      </Backdrop>
      <ButtonContainer>
        {!isAuthenticated ? (
          <Button onClick={() => onNavigate("login")}>Login</Button>
        ) : (
          <Button onClick={() => onNavigate("logout")}>Logout</Button>
        )}
        <Button onClick={() => onNavigate("join")}>Join a Room</Button>
      </ButtonContainer>
    </CenteredContent>
  )
}

export default SchedulePage
