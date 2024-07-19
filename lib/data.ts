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
	{ name: "announcements", id: "1", imageUrl: "/static/shandi.svg" },
	{ name: "routine", id: "2", imageUrl: "/static/shandi.svg" },
	{ name: "semesters", id: "3", imageUrl: "/static/shandi.svg" },
	{ name: "generalChats", id: "4", imageUrl: "/static/shandi.svg" }
];


