<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Create Note</h1>

<form method="POST">
	<label>
		Title:
		<input name="title" type="text" required />
	</label>
	<label>
		Content:
		<textarea name="content" rows="10" required></textarea>
	</label>
	<label>
		Tags (comma separated):
		<input name="tags" type="text" placeholder="work, idea, draft" />
	</label>
	<button>Save Note</button>
</form>

{#if form?.missing}
	<p class="error">Title and content are required</p>
{/if}
