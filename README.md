# SIA (Social Interaction Application)
<p align="center">
    <img 
    src="public/static/emma.svg"
    alt="Emma" 
    />
</p>

Front end of DBMS project made with [Next.js](https://nextjs.org/) bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
The backend is located @ [Electrocord](https://github.com/whoisdinanath/electrocord).

## How it looks
Just click the link listed on the side or below. If you are too lazy to click the link, here's a little preview of the website.

![loginPage](public/loginPage.png)

## Dependencies
- Node.js
- npm/pnpm

## Getting Started
1. First step open up a terminal of your choice(Alacritty/Kitty is preferred) and install the required depdencies(which is literally just two packages), using a package manager of your choice:
```bash
sudo pacman -S nodejs npm
```
2. Clone the repo somewhere into your computer and cd into the cloned repo using the following commands:
```bash
git clone https://github.com/monoastro/sia.git
cd sia
```
3. install the necessary packages using the npm as(If you're fancy you can even use pnpm):
```bash
npm i
```
4. Complex command, I know. Now then, let's run the development server:
```bash
npm run dev
```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to view the locally hosted website.


## Building the project
To build the project for deployment, run the following command:
```bash
npm run build
```
Since the necessary configuration has been already done in package.json, all you need to do is:
```bash
npm run start
```
Which might be confusing to the create-next-app crowd, but checkout package.json for clarity.

## Features
1. Cute Cat Mascot
2. Secure Authentication
    * Cookie based Login, Logout
    * Auth Based registration and password reset
3. Cached and Dynamically loaded functional components
4. Plethora of off-topic and subject based channels with real Time Chat using sockets
5. Admin privilege distinction based communication and announcements
6. Learning Platform with a dynamic library of resources required for every semester
7. Interactive UI designed with user experience in mind

## Tech Stack
* [Next.js(Frontend)](https://nextjs.org/)
* [Express.js(Backend)](https://expressjs.com/)
* [Postgresql(Database)](https://www.postgresql.org/)
* [Socket.io(Real Time Chat)](https://socket.io/)
* [Vercel(Frontend Deployment)](https://vercel.com/)
* [Render(Backend Deployment)](https://render.com/)
* [shadcn/ui(UI Components)](https://ui.shadcn.com/docs/components/)
* [TailwindCSS(Styling)](https://tailwindcss.com/)
* [Axios(HTTP Requests)](https://devdocs.io/axios/api_intro)

## Development Environment
* [Alacritty]( https://alacritty.org/ )
* [Neovim]( https://neovim.io/ )
* [Tmux](https://github.com/tmux/tmux/wiki)

## Deployed website
This project is deployed @ [Vercel](https://sia-electrocord.vercel.app/)

## Wanna read stuff?
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - reference for tailwind classes.


## Bugs
> - If you find any bugs, please report them to the issues section of this repository.
> - If you have any suggestions, please report them to the issues section of this repository.
