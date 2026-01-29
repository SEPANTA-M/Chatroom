(() => {
  const CFG = {
    title: "Cloudflare Live Chat",
    room: "general",
    ws: "ws://localhost:8787/ws",
    position: "right"
  }

  const user = "user_" + Math.floor(Math.random() * 9999)

  /* ---------- STYLE ---------- */
  const s = document.createElement("style")
  s.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600&display=swap');
  *{box-sizing:border-box;font-family:Vazirmatn,sans-serif}
  .cbtn{position:fixed;bottom:24px;${CFG.position}:24px;width:64px;height:64px;
    border-radius:50%;background:linear-gradient(135deg,#22c55e,#4ade80);
    display:flex;align-items:center;justify-content:center;cursor:pointer;
    box-shadow:0 15px 40px rgba(0,0,0,.45);z-index:9999}
  .cbtn span{font-size:26px}
  .cbox{position:fixed;bottom:100px;${CFG.position}:24px;width:360px;height:520px;
    background:rgba(15,23,42,.92);backdrop-filter:blur(18px);
    border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.65);
    display:flex;flex-direction:column;overflow:hidden;
    transform:scale(.9);opacity:0;pointer-events:none;
    transition:.35s ease;color:#fff;z-index:9999}
  .cbox.open{transform:scale(1);opacity:1;pointer-events:auto}
  .chead{padding:14px;font-weight:600;
    background:linear-gradient(135deg,#22c55e,#4ade80);color:#022c22;
    display:flex;justify-content:space-between}
  .cmsgs{flex:1;padding:14px;overflow-y:auto}
  .msg{margin-bottom:10px;animation:up .25s ease}
  .me{text-align:right}
  .bubble{display:inline-block;padding:10px 14px;border-radius:14px;
    background:rgba(255,255,255,.12);max-width:80%}
  .me .bubble{background:#22c55e;color:#022c22}
  .cin{display:flex;padding:10px;border-top:1px solid rgba(255,255,255,.08)}
  .cin input{flex:1;background:rgba(0,0,0,.4);border:none;
    border-radius:12px;padding:10px;color:#fff}
  .cin button{margin-left:6px;border:none;border-radius:12px;
    background:#4ade80;padding:0 16px;font-weight:600;cursor:pointer}
  @keyframes up{from{opacity:0;transform:translateY(6px)}
    to{opacity:1;transform:none}}
  `
  document.head.appendChild(s)

  /* ---------- UI ---------- */
  const btn = document.createElement("div")
  btn.className = "cbtn"
  btn.innerHTML = "<span>💬</span>"

  const box = document.createElement("div")
  box.className = "cbox"
  box.innerHTML = `
    <div class="chead">
      <span>${CFG.title}</span>
      <span style="cursor:pointer">✕</span>
    </div>
    <div class="cmsgs"></div>
    <div class="cin">
      <input placeholder="پیامت رو بنویس…" />
      <button>Send</button>
    </div>
  `

  document.body.append(btn, box)

  btn.onclick = () => box.classList.toggle("open")
  box.querySelector(".chead span:last-child").onclick =
    () => box.classList.remove("open")

  const msgs = box.querySelector(".cmsgs")
  const input = box.querySelector("input")
  const sendBtn = box.querySelector("button")

  const add = (text, me=false) => {
    const d = document.createElement("div")
    d.className = "msg" + (me ? " me" : "")
    d.innerHTML = `<div class="bubble">${text}</div>`
    msgs.appendChild(d)
    msgs.scrollTop = msgs.scrollHeight
  }

  /* ---------- WebSocket ---------- */
  const ws = new WebSocket(`${CFG.ws}?room=${CFG.room}`)

  ws.onmessage = e => {
    const data = JSON.parse(e.data)
    if (data.user !== user)
      add(`${data.user || "system"}: ${data.text}`)
  }

  sendBtn.onclick = () => {
    if (!input.value.trim()) return
    ws.send(JSON.stringify({ user, text: input.value }))
    add(input.value, true)
    input.value = ""
  }

  input.onkeydown = e => e.key === "Enter" && sendBtn.click()

  add("🟢 متصل شدی به سرور Cloudflare")
})()
