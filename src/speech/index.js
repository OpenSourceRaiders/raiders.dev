import Speech from "speak-tts"
// try {
const speech = new Speech()
speech.init({
  volume: 1,
  lang: "en-US",
  rate: 1,
  pitch: 0.8,
  voice: "Google UK English Female",
  splitSentences: true,
  listeners: {
    onvoiceschanged: (voices) => {
      console.log("Event voiceschanged", voices)
    },
  },
})

export default speech
