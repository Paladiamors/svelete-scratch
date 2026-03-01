<script lang="ts">
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;
</script>

<h1>Edit Todo</h1>

<form method="POST" action="?/update">
  <label>
    Title:
    <input name="title" type="text" value={data.todo.title} required />
  </label>
  <label>
    Content:
    <textarea name="content" rows="4">{data.todo.content}</textarea>
  </label>
  <label class="checkbox-label">
    <input name="is_done" type="checkbox" checked={!!data.todo.is_done} />
    Mark as done
  </label>
  <div class="actions">
    <button type="submit">Update Todo</button>
    <a href="/todos">Cancel</a>
  </div>
</form>

<form method="POST" action="?/delete" style="margin-top: 2rem;">
  <button type="submit" class="danger">Delete Todo</button>
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
  .checkbox-label {
    flex-direction: row;
    align-items: center;
  }
  textarea {
    resize: vertical;
  }
  .actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .danger {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
  }
  .error {
    color: red;
  }
</style>
