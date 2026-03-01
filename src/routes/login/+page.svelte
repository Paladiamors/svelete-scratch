<script lang="ts">
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<h1>Login</h1>

<form method="POST">
  <label>
    Username:
    <input name="username" type="text" required />
  </label>
  <label>
    Password:
    <input name="password" type="password" required />
  </label>
  <button>Login</button>
</form>

<p>Don't have an account? <a href="/register">Register here</a></p>

{#if form?.missing}
  <p class="error">Username and password are required</p>
{/if}

{#if form?.invalid}
  <p class="error">Invalid username or password</p>
{/if}
