export interface Project {
	title: string;
	client: string;
	description: string;
	pubDate: string;
	tags: string[];
	img: string;
}

export interface Post {
	title: string;
	client: string;
	description: string;
	pubDate: string;
	tags: string[];
	image: {url: string};
}
