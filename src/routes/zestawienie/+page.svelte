<svelte:head>
    <title>Zestawienie</title>
    <meta name="description" content="Zestawienie" />
</svelte:head>

<script lang="ts">
    export let data;
    let devices = data.props;
</script>

<section id="container">
    <div class="device header">
            <span class="xs">Nazwa kanału</span>
            <span class="xs">Urządzenie</span>
            <span class="xs">Nazwa urządzenia</span>
            <span class="xs">Lokalizacja</span>
            <span class="xs">Wskazanie</span>
    </div>
    {#if devices}
        {#each devices as device (device.channelId)}
            <div class="device {device.connected ? 'connected' : 'disconnected'}">
                <a href="/szczegoly/{device.channelId}">
                    <span class="xs">{device.channelCaption}</span>
                    <span class="xs">{device.deviceName}</span>
                    <span class="xs">{device.deviceComment}</span>
                    <span class="xs">{device.locationCaption}</span>
                    <span class="xs">{device.calculatedValue}{device.unit}</span>
                </a>
            </div>
        {/each}
    {/if}
</section>

<style>
    #container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .device a, .header {
        display: flex;
        gap: 10px;
        justify-content: flex-start;
        align-items: stretch;
        padding: 10px;
    }

    a {
        text-decoration: none;
        color: inherit;
        transition: background-color 0.3s;
    }

    a:hover {
        background-color: var(--gray1hover);
    }

    span {
        flex: 1; /* Wyrównuje wszystkie właściwości do tej samej szerokości */
        padding: 5px;
        text-align: center;
        min-width: 50px; /* Minimalna szerokość dla każdej właściwości */
    }

    #container > div {
        position: relative;
        background: var(--gray1);
        border-radius: 9px;
        overflow: auto;
    }

    .disconnected {
        box-shadow: -5px 0 0 0 red;
    }

    .connected {
        box-shadow: -5px 0 0 0 #00c600;
    }

</style>