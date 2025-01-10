import { createWebHistory, createRouter } from "vue-router";

const routes = [
	{
		path: "/",
		name: "Feed",
		component: () => import("../pages/Feed.vue"),
	},
	{
		path: "/post/:postId",
		name: "Post",
		component: () => import("../pages/PostPage.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(""),
	routes,
	encodeURI: false,
});
export default router;
