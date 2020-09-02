// @flow
import { gameDefs } from "../../SchedulePage/index.js"

type PlayerName = string

export type GameState = {
  timeRemaining: number,
  planIndex: number,
  inGame: boolean,
  currentTitle: string,
  activePlayers: Array<number>,
  spotlight: {
    player: number,
    until: number,
  },
}

const initialState = {
  timeRemaining: 120,
  planIndex: -1,
  inGame: false,
  currentTitle: "Starting Stream...",
  activePlayers: [0],
  spotlight: {
    player: 0,
    until: 0,
  },
}

export type Command =
  | {| type: "TIME", timeRemaining: number |}
  | {| type: "COUNTDOWN", from: number |}
  | {| type: "SAY", text: string, times?: number |}
  | {| type: "GO_TO_PLAN", index: number |}
  | {| type: "SPOTLIGHT", player: number, until?: number |}
  | {| type: "PLAYER_ACTIVE", player: number |}
  | {| type: "KICK_PLAYER", player: number |}
  | {| type: "", player: number |}

const loadPlanItem = (planItem) => {
  if (!planItem) {
    return {
      timeRemaining: 60 * 10,
      inGame: false,
      currentTitle: "Out of Game",
    }
  }
  if (planItem.name) {
    return {
      timeRemaining: Math.round(planItem.duration / 1000),
      inGame: false,
      currentTitle: planItem.name,
    }
  } else if (planItem.gameName) {
    const dets = gameDefs[planItem.gameName]
    return {
      currentTitle: planItem.gameName,
      inGame: true,
      timeRemaining: Math.floor(dets.duration / 1000),
    }
  }
}

export default ({
  state,
  command,
  dispatch,
  plan,
}: {
  state: GameState,
  command: Command,
  plan: Array<{| name: string, duration: number |} | {||}>,
  dispatch: (Command) => null,
}) => {
  if (!state) {
    state = initialState
  }
  switch (command.type) {
    case "TIME": {
      const { timeRemaining } = command
      if (timeRemaining <= 0) {
        return {
          ...state,
          ...loadPlanItem(plan[state.planIndex + 1]),
          planIndex: state.planIndex + 1,
        }
      } else if (timeRemaining === 10 && state.timeRemaining) {
        dispatch({ type: "COUNTDOWN", from: 10 })
      } else if (timeRemaining === 60 && state.inGame) {
        dispatch({ type: "SAY", text: "One Minute Remaining" })
      } else if (timeRemaining === 120 && state.inGame) {
        dispatch({ type: "SAY", text: "Two Minutes Remaining" })
      } else if (timeRemaining === 60 * 5 && state.inGame) {
        dispatch({ type: "SAY", text: "5 Minutes Remaining" })
      }

      if (timeRemaining <= state.spotlight.until) {
        const { activePlayers } = state
        const nextPlayer =
          activePlayers[
            (activePlayers.indexOf(state.spotlight.player) + 1) %
              activePlayers.length
          ]
        dispatch({
          type: "SPOTLIGHT",
          player: nextPlayer,
          until: timeRemaining - 60,
        })
      }
      return { ...state, timeRemaining }
    }
    case "GO_TO_PLAN": {
      return {
        ...state,
        ...loadPlanItem(plan[command.index]),
        planIndex: plan[command.index],
      }
    }
    case "SPOTLIGHT": {
      return {
        ...state,
        spotlight: {
          player: command.player,
          until: command.until,
        },
      }
    }
    case "KICK_PLAYER": {
      return {
        ...state,
        activePlayers: state.activePlayers.filter((p) => p !== command.player),
      }
    }
    case "PLAYER_ACTIVE": {
      return {
        ...state,
        activePlayers: Array.from(
          new Set(state.activePlayers.concat([command.player]))
        ),
      }
    }
    default: {
    }
  }

  return state
}
