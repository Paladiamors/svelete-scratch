<script lang="ts">
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<h1>Create New Todo</h1>

<form method="POST">
  <label>
    Title:
    <input name="title" type="text" required />
  </label>
  <label>
    Content:
    <textarea name="content" rows="4"></textarea>
  </label>
  <button type="submit">Create Todo</button>
  <a href="/todos">Cancel</a>
</form>

{#if form?.missing}
  <p class="error">Title is required</p>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  textarea {
    resize: vertical;
  }
  .error {
    color: red;
  }
</style>
