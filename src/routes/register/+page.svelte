<script lang="ts">
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<h1>Register</h1>

<form method="POST">
  <label>
    Username:
    <input name="username" type="text" required />
  </label>
  <label>
    Password:
    <input name="password" type="password" required />
  </label>
  <button>Register</button>
</form>

{#if form?.missing}
  <p class="error">Username and password are required</p>
{/if}

{#if form?.userExists}
  <p class="error">User already exists</p>
{/if}
