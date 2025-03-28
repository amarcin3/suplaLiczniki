<script>
    import { flip } from 'svelte/animate';
    import { fly } from 'svelte/transition';
    import { notifications } from './notifications';

    const themes = {
        wait: '#ff3e00',
        error: '#B00020',
        success: '#00b300',
        info: '#7e7e7e'
    };
</script>

<div class="notifications">
    {#each $notifications as notification (notification.id)}
        <div
                animate:flip={{ duration: 300 }}
                class="toast"
                style="background: {themes[notification.type]};"
                in:fly={{ y: 10 }}
                out:fly={{ x: 50 }}
        >
            <span>{notification.message}</span>

            {#if notification.type === 'wait'}
                <div class="spinner"></div>
            {:else if notification.type === 'error'}
                <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 256 256"
                        xml:space="preserve"
                ><g
						style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
						transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
						><path
							d="M 13.4 88.492 L 1.508 76.6 c -2.011 -2.011 -2.011 -5.271 0 -7.282 L 69.318 1.508 c 2.011 -2.011 5.271 -2.011 7.282 0 L 88.492 13.4 c 2.011 2.011 2.011 5.271 0 7.282 L 20.682 88.492 C 18.671 90.503 15.411 90.503 13.4 88.492 z"
							style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: white; fill-rule: nonzero; opacity: 1;"
							transform=" matrix(1 0 0 1 0 0) "
							stroke-linecap="round"
						/><path
                        d="M 69.318 88.492 L 1.508 20.682 c -2.011 -2.011 -2.011 -5.271 0 -7.282 L 13.4 1.508 c 2.011 -2.011 5.271 -2.011 7.282 0 l 67.809 67.809 c 2.011 2.011 2.011 5.271 0 7.282 L 76.6 88.492 C 74.589 90.503 71.329 90.503 69.318 88.492 z"
                        style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: white; fill-rule: nonzero; opacity: 1;"
                        transform=" matrix(1 0 0 1 0 0) "
                        stroke-linecap="round"
                /></g
					></svg
                >
            {:else if notification.type === 'success'}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                ><path
                        d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
                        fill="white"
                /></svg
                >
            {:else if notification.type === 'info'}
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 192 512"
                ><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
                        d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z"
                /></svg
                >
            {/if}

            {#if notification.icon}<i class={notification.icon}></i>{/if}
        </div>
    {/each}
</div>

<style>
    .notifications {
        position: fixed;
        top: 50px;
        right: 1vh;
        padding: 0;
        z-index: 999;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: end;
        pointer-events: none;
    }

    .toast {
        width: 15rem;
        height: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        box-shadow: rgba(0, 0, 0, 0.2) 3px 10px 20px -10px;
        border-radius: 5px;
        color: white;
        margin-bottom: 10px;
    }

    .spinner {
        width: 1rem;
        height: 1rem;
        border: 3px solid transparent;
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>