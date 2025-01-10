const API_KEY = "34447c68-f891-40ce-a165-2b541f2a0e17";
const API_BASE_URL = "https://content-api.boberneprotiv.com/";

const request = async (endpoint, method, data) => {
	try {
		const responce = await fetch(API_BASE_URL + endpoint, {
			method,
			headers: {
				"Content-Type": "application/json",
				"Authorization": API_KEY,
			},
			body: JSON.stringify(data),
		});
		if (responce.ok) {
			if (method === "DELETE" || method === "PUT") return;

			return await responce.json();
		}
	} catch (err) {
		throw new Error(err);
	}
};

export const getPosts = async (order) => {
	return await request(
		`publications?order=${order}`
		// `publications?cursor=${cursor}&take=${take}&order=${order}`
	);
};

export const createPost = async (content) => {
	if (!content) return;

	return await request("publications", "POST", { content });
};

export const getPostById = async (postId) => {
	return await request(`publications/${postId}`);
};

export const updatePostById = async (postId, content) => {
	if (!content) return;

	return await request(`publications/${postId}`, "PUT", { content });
};

export const deletePostById = async (postId) => {
	return await request(`publications/${postId}`, "DELETE");
};
