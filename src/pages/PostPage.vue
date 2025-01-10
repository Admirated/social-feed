<template>
	<div class="head">
		<h1>Post id: {{ $route.params.postId }}</h1>
		<RouterLink class="link" :to="{ name: 'Feed' }">Back to Feed</RouterLink>
	</div>
	<Post
		v-if="post.id"
		:post="post"
		@delete="deletePostHandler"
		@update="loadPost"
	/>
</template>

<script>
import Post from "@/components/Post.vue";
import { getPostById } from "@/api";
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
	components: { Post },
	setup() {
		const route = useRoute();
		const router = useRouter();

		const post = reactive({
			id: "",
			content: "",
			createdOn: "",
			updatedOn: "",
		});

		const loadPost = async () => {
			try {
				const res = await getPostById(route.params.postId);
				if (!res?.id) return;

				Object.assign(post, res);
			} catch (e) {
				console.error(e.message);
			}
		};

		loadPost();

		const deletePostHandler = () => {
			router.push({ name: "Feed" });
		};

		return { post, loadPost, deletePostHandler };
	},
};
</script>

<style lang="scss" scoped>
.head {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
}
.link {
	display: block;
	margin-top: 24px;
	font-size: 1.2em;
	text-decoration: none;
	color: var(--primary-color);
}
</style>
