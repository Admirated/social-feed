<template>
	<div class="feed">
		<header class="feed__header">
			<div class="new-post">
				<textarea
					placeholder="Write your post here..."
					v-model="content"
				></textarea>
				<button @click="createPostHandler">Publish</button>
			</div>
		</header>

		<h1>Feed</h1>

		<main class="feed__publications">
			<div class="publication-list" v-if="posts.length">
				<Post
					v-for="post in posts"
					:key="post.id"
					:post="post"
					@delete="loadPosts"
					@update="loadPosts"
				/>
			</div>
			<p class="publication-empty" v-else>There are no posts here yet</p>
		</main>
	</div>
</template>

<script>
import Post from "@/components/Post.vue";
import { getPosts, createPost } from "@/api";
import { ref } from "vue";

export default {
	name: "Feed",
	components: { Post },
	setup() {
		const content = ref("");
		const order = ref("Desc");
		const posts = ref([]);
		const isPostsLoading = ref(false);
		const isPostCreating = ref(false);

		const loadPosts = async () => {
			isPostsLoading.value = true;

			try {
				const res = await getPosts(order.value);
				if (!res?.length) {
					posts.value = [];
					return;
				}

				posts.value = res;
			} catch (e) {
				console.error("[loadPosts]:", e.message);
			} finally {
				isPostsLoading.value = false;
			}
		};
		loadPosts();

		const createPostHandler = async () => {
			if (!content.value || isPostCreating.value) return;

			try {
				isPostCreating.value = true;
				const responce = await createPost(content.value);
				if (!responce?.id) return;

				content.value = "";
				await loadPosts();
			} catch (e) {
				console.error("[createPostHandler]:", e.message);
			} finally {
				isPostCreating.value = false;
			}
		};

		return {
			content,
			posts,
			loadPosts,
			createPostHandler,
		};
	},
};
</script>

<style lang="scss" scoped>
.feed {
	display: flex;
	flex-direction: column;
	max-height: 100%;
	&__publications {
		margin-top: 20px;
	}
	&__header {
		text-align: center;
		margin-bottom: 20px;
	}
}

h1 {
	color: var(--primary-color);
	font-size: 2.5em;
	margin-bottom: 10px;
	text-align: center;
}

.new-post {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 10px;
}

textarea {
	width: 100%;
	height: 100px;
	padding: 10px;
	border: 1px solid var(--primary-color);
	border-radius: 5px;
	font-size: 1em;
	resize: none;
}

.new-post button {
	background-color: var(--primary-color);
	color: var(--secondary-color);
	border: none;
	padding: 10px 20px;
	font-size: 1em;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s;
	&:hover {
		opacity: 0.9;
	}
}

.publication-list {
	display: flex;
	flex-direction: column;
	gap: 15px;
	padding: 0 16px;
	overflow-y: auto;
	max-height: 400px;
}
.publication-empty {
	text-align: center;
	padding-top: 24px;
	color: var(--text-color);
}
</style>
