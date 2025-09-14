<script lang="ts">
    import { onMount } from 'svelte';

    

    let jsonData: any[] = [];
    let loading = true;

    onMount(async () => {
        const res = await fetch('/data.json');
        jsonData = await res.json();
        loading = false;
    });
</script>

{#if loading}
    <p>Loading data...</p>
{:else}
    <pre>{JSON.stringify(jsonData, null, 2)}</pre>

    <!-- Falls du die Daten tabellarisch anzeigen willst -->
    {#if Array.isArray(jsonData)}
        <table>
            <thead>
                <tr>
                    {#each Object.keys(jsonData[0] || {}) as key}
                        <th>{key}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each jsonData as row}
                    <tr>
                        {#each Object.values(row) as value}
                            <td>{value}</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
{/if}

<style>
    table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 1rem;
    }
    th, td {
        border: 1px solid #ccc;
        padding: 0.5rem;
        text-align: left;
    }
    th {
        background: #f2f2f2;
    }
</style>
