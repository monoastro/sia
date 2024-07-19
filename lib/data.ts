type Tab = {
	name: string;
	id: string;
	imageUrl: string;
};

interface User {
	id: string;
	name: string;
	profileImageUrl: string;
};


export const tabs: Tab[] = [
	{ name: "announcements", id: "1", imageUrl: "/static/emma.svg" },
	{ name: "routine", id: "2", imageUrl: "/static/emma.svg" },
	{ name: "semesters", id: "3", imageUrl: "/static/emma.svg" },
	{ name: "generalChats", id: "4", imageUrl: "/static/emma.svg" }
];


