export default {
  fetch(req, env) {
    const url = new URL(req.url)

    if (url.pathname === "/ws") {
      const room = url.searchParams.get("room") || "general"
      const id = env.CHAT.idFromName(room)
      return env.CHAT.get(id).fetch(req)
    }

    return new Response("CF Chat Server Online 🚀")
  }
}

export class ChatRoom {
  constructor(state) {
    this.state = state
    this.clients = new Set()
  }

  async fetch(req) {
    if (req.headers.get("Upgrade") !== "websocket")
      return new Response("WebSocket only", { status: 400 })

    const pair = new WebSocketPair()
    const [client, server] = Object.values(pair)

    server.accept()
    this.clients.add(server)

    server.send(JSON.stringify({
      type: "system",
      text: "👋 کاربر جدید وصل شد"
    }))

    server.onmessage = e => {
      for (const ws of this.clients) {
        ws.send(e.data)
      }
    }

    server.onclose = () => {
      this.clients.delete(server)
    }

    return new Response(null, { status: 101, webSocket: client })
  }
}
