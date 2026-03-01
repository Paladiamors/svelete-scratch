<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="layout">
  <aside class="sidebar">
    <nav>
      <ul>
        <li><a href="/">Notes</a></li>
        <li><a href="/todos">Todos</a></li>
      </ul>
    </nav>
  </aside>
  <main class="content">
    {@render children()}
  </main>
</div>

<style>
  .layout {
    display: flex;
    min-height: 100vh;
  }
  .sidebar {
    width: 200px;
    background-color: #f4f4f4;
    padding: 1rem;
    border-right: 1px solid #ccc;
  }
  .sidebar ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .sidebar li {
    margin-bottom: 0.5rem;
  }
  .sidebar a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }
  .content {
    flex-grow: 1;
    padding: 2rem;
  }
</style>
