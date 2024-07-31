//contains all of the get calls and base information stuff

const defpfpLocal : string = "/static/emma.svg";
const defpfpURL : string = "https://raw.githubusercontent.com/monoastro/sia/main/public/static/emma.svg";

//nav bar stuff
type Tab = 
{
	name: string;
	id: number;
	imageUrl: string;
};
const tabs: Tab[] =
[
	{ name: "Announcements", id: 1, imageUrl: "/static/emma.svg" },
	{ name: "Routine", 	   id: 2, imageUrl: "/static/emma.svg" },
	{ name: "Semesters", 	   id: 3, imageUrl: "/static/emma.svg" },
	{ name: "General Chats", id: 4, imageUrl: "/static/emma.svg" }
];
const getActualRouteName : string[] = 
[
	"dashboard",
	"announcements",
	"routine",
	"semesters",
	"generalChats",
]

export { tabs, defpfpLocal, defpfpURL, getActualRouteName};

