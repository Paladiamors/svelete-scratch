<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<h1>My Notes</h1>

<a href="/notes/new">Create New Note</a>

<div class="notes-list">
    {#if data.notes.length === 0}
        <p>No notes found.</p>
    {:else}
        {#each data.notes as note}
            <div class="note-card">
                <h2><a href="/notes/{note.id}">{note.title}</a></h2>
                <p>{note.content.substring(0, 100)}...</p>
                {#if note.tags.length > 0}
                    <div class="tags">
                        Tags:
                        {#each note.tags as tag}
                            <span class="tag">{tag}</span>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    {/if}
</div>

<form action="/logout" method="POST" style="margin-top: 2rem;">
    <button>Logout</button>
</form>

<style>
    .note-card {
        border: 1px solid #ccc;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
    }
    .tag {
        background-color: #eee;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        margin-right: 0.5rem;
        font-size: 0.8rem;
    }
</style>
