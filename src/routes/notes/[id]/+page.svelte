<script lang="ts">
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let { note } = data;
</script>

<h1>Edit Note</h1>

<form method="POST" action="?/update">
	<label>
		Title:
		<input name="title" type="text" value={note.title} required />
	</label>
	<label>
		Content:
		<textarea name="content" rows="10" required>{note.content}</textarea>
	</label>
	<label>
		Tags (comma separated):
		<input name="tags" type="text" value={note.tags.join(', ')} />
	</label>
	<button>Update Note</button>
</form>

<form method="POST" action="?/delete">
	<button style="background-color: #d88;">Delete Note</button>
</form>

<p>
	<a href="/">Back to Notes</a>
</p>

{#if form?.missing}
	<p class="error">Title and content are required</p>
{/if}

{#if form?.success}
	<p class="success">Note updated successfully!</p>
{/if}
