//contains all of the get calls and base information stuff
import { getAPI } from "@/lib/api";
const defpfpLocal : string = "/static/emma.svg";
const defpfpURL : string = "https://raw.githubusercontent.com/monoastro/sia/main/public/static/emma.svg";

type Tab = 
{
	name: string;
	id: string;
	imageUrl: string;
};

const tabs: Tab[] =
[
	{ name: "announcements", id: "1", imageUrl: "/static/emma.svg" },
	{ name: "routine", id: "2", imageUrl: "/static/emma.svg" },
	{ name: "semesters", id: "3", imageUrl: "/static/emma.svg" },
	{ name: "generalChats", id: "4", imageUrl: "/static/emma.svg" }
];

interface User {
	id: string;
	imageUrl: string;
	name: string;
	isAdmin: boolean;
};
const users : User[] = [
	{ "id": "1", "imageUrl": "/static/emma.svg", "name": "Emma", "isAdmin": true },
	{ "id": "2", "imageUrl": "/static/emma.svg", "name": "John", "isAdmin": false },
	{ "id": "3", "imageUrl": "/static/emma.svg", "name": "Jane", "isAdmin": false },
	{ "id": "4", "imageUrl": "/static/emma.svg", "name": "Doe", "isAdmin": false },
	{ "id": "5", "imageUrl": "/static/emma.svg", "name": "Smith", "isAdmin": false }
];






export { tabs, defpfpLocal, defpfpURL, users };

