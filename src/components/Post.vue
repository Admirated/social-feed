<template>
	<div class="publication">
		<RouterLink
			class="content"
			:to="{ name: 'Post', params: { postId: post.id } }"
		>
			{{ post.content }}
		</RouterLink>

		<input type="text" v-model="updatedContent" v-if="isEditMode" />
		<div class="meta">
			<span class="date">Published on: {{ formattedCreateDate }}</span>
			<span
				v-if="isPostUpdated"
				class="updated"
				:data-tooltip="`Last updated: ${formattedUpdateDate}`"
				>🛈</span
			>
		</div>
		<div class="actions">
			<template v-if="isEditMode">
				<button @click="closeEditHandler">Undo</button>
				<button @click="updatePostHandler">Update</button>
			</template>
			<template v-else>
				<button @click="openEditHandler">Edit</button>
				<button @click="deletePostHandler">Delete</button>
			</template>
		</div>
	</div>
</template>

<script>
import { computed, ref } from "vue";
import { deletePostById, updatePostById } from "@/api";

export default {
	props: {
		post: { type: Object, default: () => {}, required: true },
	},
	emits: ["delete", "update"],
	setup(props, ctx) {
		const isEditMode = ref(false);
		const updatedContent = ref("");
		const isPostUpdating = ref(false);
		const isPostDeleting = ref(false);

		const openEditHandler = () => (isEditMode.value = true);

		const closeEditHandler = () => {
			isEditMode.value = false;
			updatedContent.value = "";
		};

		const deletePostHandler = async () => {
			if (isPostDeleting.value) return;

			try {
				isPostDeleting.value = true;
				await deletePostById(props.post.id);
			} catch (e) {
				console.error("[deletePostHandler]:", e.message);
			} finally {
				isPostDeleting.value = false;
			}

			ctx.emit("delete");
		};

		const updatePostHandler = async () => {
			if (
				isPostUpdating.value ||
				!updatedContent.value ||
				updatedContent.value === props.post.content
			) {
				return;
			}

			try {
				isPostUpdating.value = true;
				await updatePostById(props.post.id, updatedContent.value);
			} catch (e) {
				console.error("[updatePostHandler]:", e.message);
			} finally {
				isPostUpdating.value = false;
			}

			ctx.emit("update");
			closeEditHandler();
		};

		const formattedCreateDate = computed(() => {
			const now = new Date();
			const postDate = new Date(props.post.createdOn);

			const diffInSeconds = Math.floor((now - postDate) / 1000);
			const isToday = postDate.toDateString() === now.toDateString();

			if (diffInSeconds < 60) {
				return "Just now";
			} else if (diffInSeconds < 3600) {
				return "Less than 1 hour ago";
			} else if (isToday) {
				return postDate.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				});
			} else {
				return postDate
					.toLocaleString("en-US", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					})
					.replace(",", "");
			}
		});

		const formattedUpdateDate = computed(() => {
			if (!props.post.updatedOn) return "";

			return new Date(props.post.createdOn)
				.toLocaleString("en-US", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				})
				.replace(",", "");
		});

		const isPostUpdated = computed(() => {
			return props.post.createdOn !== props.post.updatedOn;
		});

		return {
			isEditMode,
			updatedContent,
			formattedCreateDate,
			formattedUpdateDate,
			isPostUpdated,
			openEditHandler,
			closeEditHandler,
			deletePostHandler,
			updatePostHandler,
		};
	},
};
</script>

<style lang="scss" scoped>
.publication {
	background-color: var(--secondary-color);
	border: 1px solid var(--primary-color);
	border-radius: 5px;
	padding: 15px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	position: relative;
	.content {
		display: block;
		text-decoration: none;
		color: var(--primary-color);
		font-size: 1em;
		margin-bottom: 10px;
		&:hover {
			opacity: 0.75;
		}
	}
	.meta {
		font-size: 0.9em;
		color: var(--text-color);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.updated {
		position: relative;
		font-size: 1em;
		cursor: pointer;
		&:hover::after {
			content: attr(data-tooltip);
			position: absolute;
			bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
			background: rgba(0, 0, 0, 0.8);
			color: var(--secondary-color);
			padding: 5px 10px;
			border-radius: 5px;
			white-space: nowrap;
			font-size: 0.8em;
		}
	}

	.actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;

		button {
			background-color: transparent;
			border: 1px solid var(--primary-color);
			padding: 5px 10px;
			font-size: 0.9em;
			border-radius: 5px;
			cursor: pointer;
			transition: background-color 0.3s, color 0.3s;

			&:hover {
				background-color: var(--primary-color);
				color: var(--secondary-color);
			}
		}
	}
}
</style>
