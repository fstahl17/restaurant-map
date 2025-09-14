<script lang="ts">
    import places from '../../src/data.json';
<<<<<<< HEAD
    import { slide, fade } from 'svelte/transition';
    import { base } from '$app/paths';
=======
    import { fade } from 'svelte/transition';
>>>>>>> parent of 4f92f58 (style and headline progress)
  
    export let placeId: string;
    export let open = false;
    export let onClose: () => void = () => {};

    $: record = places.find(
        (item) => item["Place Id - Location"] === placeId
    );

    $: name = record ? record["Name - Location"] : null;
    $: adress = record ? record["Formatted Address - Location"] : null;
    $: date = record ? record["Submitted Date"] : null;
    $: type = record ? record["Restaurant Type"] : null;
    $: ersterEindruck = record ? record["Überzeugt der erste Eindruck?"] : null;
    $: service = record ? record["Ist das Service den Umständen entsprechend hochwertig?"] : null;
    $: ambiente = record ? record["Ist das Ambiente / Einrichtung des Objekts passend?"] : null;
    $: bTitel = record ? record["Bestellte Gerichte - Titel der bestellten Speise:"] : null;
    $: bEmpfehlung = record ? record["Bestellte Gerichte - Dieses Gericht würde ich weiterempfehlen"] : null;
    $: bVergleich = record ? record["Bestellte Gerichte - Wie gut mir dieses Gericht im direkten Vergleich zu ähnlichen Speisen geschmeckt hat."] : null;
    $: empfehlung = record ? record["Würde ich dieses Restaurant weiterempfehlen / bzw. wiederkommen?"] : null;
    $: preisLeistung = record ? record["War das Verhältnis von Preis / Leistung gerechtfertigt?"] : null;
    $: anmerkungen = record ? record["Weitere Anmerkungen zum Personal / Empfohlenen Speisen / ..."] : null;
    $: reviewvon = record ? record["Review von:"] : null;

  </script>
  
  {#if open}
    <div class="backdrop" on:click={onClose} transition:fade={{ duration: 150 }} />
        <section class="panel" transition:fade={{ duration: 200 }} role="dialog" aria-modal="true">
            <button class="close" on:click={onClose} aria-label="Schließen">×</button>
            <h1>{name}</h1>
            <h2>{adress}</h2>
        </section>
    {/if}
  
  
    <style>
        .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 999; }
        .panel { position: fixed; left: 0; right: 0; bottom: 0; height: 60vh; background: #fff; border-top-left-radius: 16px; border-top-right-radius: 16px; box-shadow: 0 -10px 30px rgba(0,0,0,.2); z-index: 1000; overflow: auto; padding: 1rem; }
        .close { position: absolute; right: .75rem; top: .5rem; font-size: 1.5rem; line-height: 1; background: transparent; border: 0; cursor: pointer; }
    </style>
  