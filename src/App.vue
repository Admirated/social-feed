<template>
	<div class="container">
		<RouterView />
	</div>
</template>

<script setup></script>

<style lang="scss">
:root {
	--primary-color: #4caf50;
	--secondary-color: #ffffff;
	--background-color: #f9f9f9;
	--text-color: #333;
}

*,
*::before,
*::after {
	box-sizing: border-box;
}

body,
html,
#app,
.container {
	width: 100%;
	height: 100%;
	max-height: 100%;
}

body {
	font-family: Arial, sans-serif;
	margin: 0;
	padding: 0;
	background-color: var(--background-color);
	color: var(--text-color);
}

.container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}
</style>
