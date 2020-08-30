require("dotenv")
const faunadb = require("faunadb")
const q = faunadb.query
const { send, json } = require("micro")
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
})

// Turn...
// https://obs.ninja/?room=RAIDERS_DEV&push=7F4eLMe
// Into...
// https://obs.ninja/?view=7F4eLMe&scene=1&room=RAIDERS_DEV
const replacePushUrl = (url) => {
  try {
    const pushId = url.match(/push=([a-z0-9A-Z]+)/)[1]
    if (!pushId) return url
    return `https://obs.ninja/?view=${pushId}&scene=1&room=RAIDERS_DEV`
  } catch (e) {
    return url
  }
}

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const streams = (
      await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index("all_streams"))),
          q.Lambda("X", q.Get(q.Var("X")))
        )
      )
    ).data.map((s) => ({ ...s.data, id: s.ref.id }))

    const random = (
      await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index("random_all"))),
          q.Lambda("X", q.Get(q.Var("X")))
        )
      )
    ).data.reduce((acc, { data: { key, val } }) => ((acc[key] = val), acc), {})

    return send(res, 200, {
      allStreams: streams,
      random,
    })
  } else if (req.method === "POST") {
    const { spotlight, id, raiderName, camera, screen } = req.body
    console.log({ spotlight, id, raiderName, camera, screen })
    if (raiderName && id) {
      await client.query(
        q.Update(q.Ref(q.Collection("raider_stream"), id), {
          data: {
            raiderName,
            camera: replacePushUrl(camera),
            screen: replacePushUrl(screen),
          },
        })
      )
    } else if (spotlight) {
      await client.query(
        q.Update(q.Select("ref", q.Get(q.Match(q.Index("key"), "spotlight"))), {
          data: {
            key: "spotlight",
            val: spotlight,
          },
        })
      )
    }
    send(
      res,
      200,
      "<html><script type=\"text/javascript\">window.location.href='/'</script></html>"
    )
  }
}
