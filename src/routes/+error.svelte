<script lang="ts">
    import { page } from '$app/state';

    let errorMsg: string = '';
    if (page.error === null) {
        errorMsg = 'An error occurred';
    } else {
        errorMsg = page.error.message;
    }
</script>

<svelte:head>
    <title>{page.status} - {errorMsg}</title>
    <meta name="description" content="Error" />
</svelte:head>

<div class="error">
    <span class="status">{page.status}</span>
    <div class="message">
        <h1>{errorMsg}</h1>
    </div>
</div>

<style>
    .error {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    .status {
        font-weight: 200;
        font-size: 3rem;
        line-height: 1;
        position: relative;
        top: -0.05rem;
    }

    .message {
        border-left: 1px solid #666;
        padding: 0 0 0 1rem;
        margin: 0 0 0 1rem;
        min-height: 2.5rem;
        display: flex;
        align-items: center;
    }

    .message h1 {
        font-weight: 400;
        font-size: 1em;
        margin: 0;
    }
</style>