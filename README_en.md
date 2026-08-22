<div align="center">
  <img src="docs/assets/logo.svg" width="112" alt="NewsHub-Vue">
  <h1>NewsHub-Vue</h1>
  <p><strong>Frontend for the NewsHub community</strong></p>
  <p>Vue 3 + TypeScript + Vite. Accounts, feeds, nested comments, likes, and follows — talks to <a href="https://github.com/Chillwinner/NewsHub">NewsHub</a>.</p>
  <p>
    <a href="./README.md">简体中文</a> ·
    <a href="./README_en.md">English</a>
  </p>
  <p>
    <a href="https://github.com/Chillwinner/NewsHub-Vue/stargazers"><img src="https://img.shields.io/github/stars/Chillwinner/NewsHub-Vue?style=flat-square" alt="Stars"></a>
    <img src="https://img.shields.io/badge/Vue-3-42b883?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3">
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  </p>
</div>

Pairs with the CQRS backend [NewsHub](https://github.com/Chillwinner/NewsHub). Dark theme via CSS tokens. The Chinese README has the page map and interview notes.

## Features

- Phone register / login / logout; token kept in Pinia + `localStorage`
- Site-wide feed and a “following” feed after login
- Create / edit / delete / like posts (edit only for the author)
- Nested comment trees, likes, delete
- Follow / unfollow, counts, profile pages
- Dashboard for nickname, email, my posts, and following list

```text
Browser (this repo) --/api--> Vite proxy --> NewsHub gateway :8080 --> read / write services
```

## Quick start

Need Node.js `^20.19.0` or `>=22.12.0`, and [NewsHub](https://github.com/Chillwinner/NewsHub) on `http://localhost:8080`.

```bash
git clone https://github.com/Chillwinner/NewsHub-Vue.git
cd NewsHub-Vue
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` to the gateway (`vite.config.ts` → `server.proxy['/api'].target`).

```bash
npm run build
npm run preview
npm run type-check
```

In production, serve `dist/` and reverse-proxy `/api` to the gateway.

## License

MIT
