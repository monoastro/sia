//contains all of the get calls and base information stuff

const defpfpLocal : string = "/static/emma.svg";
const defpfpURL : string = "https://raw.githubusercontent.com/monoastro/sia/main/public/static/emma.svg";
const apiBaseUrl : string =  "https://electrocord.onrender.com";
const apiBaseUrlLocal : string = "http://localhost:5000";

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
	{ name: "Chats", id: 4, imageUrl: "/static/emma.svg" }
];
const getActualRouteName : string[] = 
[
	"dashboard",
	"announcements",
	"routine",
	"semesters",
	"generalChats",
]

export { tabs, defpfpLocal, defpfpURL, getActualRouteName, apiBaseUrl};

