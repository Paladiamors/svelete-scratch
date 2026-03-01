<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>Todos</h1>

<a href="/todos/new">Create New Todo</a>

<form method="GET" class="filters">
  <input type="text" name="q" placeholder="Search..." value={data.q} />
  <select name="filter" value={data.filter}>
    <option value="all">All</option>
    <option value="done">Done</option>
    <option value="not_done">Not Done</option>
  </select>
  <button type="submit">Filter/Search</button>
</form>

<div class="todos-list">
  {#if data.todos.length === 0}
    <p>No todos found.</p>
  {:else}
    <ul>
      {#each data.todos as todo}
        <li class="todo-item" class:done={todo.is_done}>
          <form
            method="POST"
            action="?/toggle"
            class="toggle-form"
            style="display:inline; margin:0; padding:0; background:none; border:none; box-shadow:none;"
          >
            <input type="hidden" name="id" value={todo.id} />
            <label
              class="checkbox-label"
              title={todo.is_done ? 'Mark as not done' : 'Mark as done'}
            >
              <input
                type="checkbox"
                checked={!!todo.is_done}
                onchange={(e) => e.currentTarget.form?.submit()}
              />
              <span class="checkbox-text">{todo.is_done ? 'Done' : 'Pending'}</span>
            </label>
          </form>
          <div
            class="todo-content"
            style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.25rem; flex-grow: 1; text-align: left; width: 100%;"
          >
            <div style="font-size: 1.1rem; font-weight: bold;">
              <a href="/todos/{todo.id}" style="color: inherit; text-decoration: none;"
                >{todo.title}</a
              >
            </div>
            <p class="todo-desc" style="margin:0; color: #666; font-size: 0.95rem;">
              {todo.content}
            </p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .filters {
    margin: 1rem 0;
    display: flex;
    gap: 0.5rem;
  }
  .todos-list ul {
    list-style-type: none;
    padding: 0;
  }
  .todo-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1.5rem;
    padding: 1rem 1.5rem;
    border: 1px solid #e0e0e0;
    margin-bottom: 0.75rem;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  .todo-item form {
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
    background: transparent;
  }
  .todo-item.done .todo-content {
    opacity: 0.6;
    text-decoration: line-through;
  }
  .toggle-form {
    display: flex;
    align-items: center;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
  }
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.85rem;
    color: #666;
    user-select: none;
  }
  .checkbox-label input[type='checkbox'] {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
    margin: 0;
  }
  .todo-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .todo-desc {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }
</style>
