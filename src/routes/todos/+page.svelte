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
          <form method="POST" action="?/toggle" class="toggle-form">
            <input type="hidden" name="id" value={todo.id} />
            <input
              type="checkbox"
              checked={!!todo.is_done}
              onchange={(e) => e.currentTarget.form?.submit()}
            />
          </form>
          <div class="todo-content">
            <a href="/todos/{todo.id}"><strong>{todo.title}</strong></a>
            <p>{todo.content}</p>
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
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    margin-bottom: 0.5rem;
    border-radius: 4px;
  }
  .todo-item.done {
    opacity: 0.6;
    text-decoration: line-through;
  }
  .toggle-form {
    margin-top: 0.25rem;
  }
  .todo-content {
    flex-grow: 1;
  }
  .todo-content p {
    margin: 0.5rem 0 0 0;
  }
</style>
