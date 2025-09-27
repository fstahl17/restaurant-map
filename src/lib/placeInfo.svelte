<script lang="ts">
  import places from '../../src/data.json';
  import { slide, fade } from 'svelte/transition';
  import { Check, ThumbsUp, ThumbsDown } from 'lucide-svelte';
  import { normalizePlaces, type Place } from '$lib/normalizePlaces';

  export let placeId: string;
  export let open = false;
  export let onClose: () => void = () => {};

  const normalized: Place[] = normalizePlaces(places as any[]);

  $: record = normalized.find(p => p.placeId === placeId);

  let name: string | undefined;
let adress: string | undefined;
let date: string | undefined;
let restype: string | undefined;
let ersterEindruck: string | undefined;
let service: string | undefined;
let ambiente: string | undefined;
let empfehlung: string | undefined;
let preisLeistung: string | undefined;
let anmerkungen: string | undefined;
let reviewvon: string | undefined;

$: name = record?.name;
$: adress = record?.address;
$: date = record?.date;
$: restype = record?.restype;
$: ersterEindruck = record?.firstImpression;
$: service = record?.service;
$: ambiente = record?.ambience;
$: empfehlung = record?.wouldReturn;
$: preisLeistung = record?.priceValue;
$: anmerkungen = record?.notes;
$: reviewvon = record?.reviewer;

  function iconFor(val?: string | null) {
    if (!val || undefined) return null;
    const t = String(val).toLowerCase();
    if (/(^|\b)like(\b|!|\.|,)/.test(t)) return ThumbsUp;
    if (/dislike/.test(t)) return ThumbsDown;
    return Check;
  }

  function iconColor(val?: string) {
    if (!val) return undefined;
    const Icon = iconFor(val);
    if (Icon === ThumbsUp) return '#16a34a';   // grün
    if (Icon === ThumbsDown) return '#dc2626'; // rot
    return '#111827';                           // neutral/dunkel
  }

  $: IconErster = iconFor(ersterEindruck);
  $: IconService = iconFor(service);
  $: IconAmbiente = iconFor(ambiente);
  $: IconEmpfehlung = iconFor(empfehlung);
  $: IconPreis = iconFor(preisLeistung);
</script>
  
  {#if open}
    <div class="backdrop" on:click={onClose} transition:fade={{ duration: 150 }} />
    <section class="panel" transition:slide={{ duration: 200 }} role="dialog" aria-modal="true" on:click|stopPropagation>
      <button class="close" on:click={onClose} aria-label="Schließen">×</button>
  
      <div class="flex flex-wrap items-baseline gap-2">
        <h1 class="text-xl font-semibold">{name}</h1>
        {#if date}<span class="chip">getestet am {date}</span>{/if}
      </div>
      {#if adress}<p class="mt-1 text-sm text-gray-600">{adress}</p>{/if}
  
      <div class="mt-4 flex items-center justify-between">
        <h2 class="text-md font-bold">Kurzüberblick</h2>
        {#if reviewvon}<span class="chip-muted">Review von {reviewvon}</span>{/if}
      </div>
  
      <ul class="mt-3 space-y-2">
        {#if restype}
          <li class="item"><span class="label">Restaurant-Typ</span><span class="value">{restype}</span></li>
        {/if}
  
        {#if ersterEindruck}
          <li class="item">
            <span class="label">Erster Eindruck</span>
            {#if IconErster}
              <svelte:component this={IconErster} class="icon" color={iconColor(ersterEindruck)} />
            {:else}
              <span class="value">{ersterEindruck}</span>
            {/if}
          </li>
        {/if}
  
        {#if service}
          <li class="item">
            <span class="label">Service</span>
            {#if IconService}
              <svelte:component this={IconService} class="icon" color={iconColor(service)} />
            {:else}
              <span class="value">{service}</span>
            {/if}
          </li>
        {/if}
  
        {#if ambiente}
          <li class="item">
            <span class="label">Ambiente</span>
            {#if IconAmbiente}
              <svelte:component this={IconAmbiente} class="icon" color={iconColor(ambiente)} />
            {:else}
              <span class="value">{ambiente}</span>
            {/if}
          </li>
        {/if}
  
        {#if empfehlung}
          <li class="item">
            <span class="label">Wiederkommen?</span>
            {#if IconEmpfehlung}
              <svelte:component this={IconEmpfehlung} class="icon" color={iconColor(empfehlung)} />
            {:else}
              <span class="value">{empfehlung}</span>
            {/if}
          </li>
        {/if}
  
        {#if preisLeistung}
          <li class="item">
            <span class="label">Preis/Leistung</span>
            {#if IconPreis}
              <svelte:component this={IconPreis} class="icon" color={iconColor(preisLeistung)} />
            {:else}
              <span class="value">{preisLeistung}</span>
            {/if}
          </li>
        {/if}
      </ul>
  
      {#if record?.dishes?.length}
        <div class="section">
            <h3 class="section-title">Bestellte Gerichte</h3>
            <ul class="space-y-2">
            {#each record.dishes as d}
                <li class="item">
                <span class="label">{d.title}</span>
                {#if d.recommend}
                    {#if iconFor(d.recommend)}
                    <svelte:component this={iconFor(d.recommend)} class="icon" color={iconColor(d.recommend)} />
                    {:else}
                    <span class="value">{d.recommend}</span>
                    {/if}
                {/if}
                </li>
                {#if d.score !== undefined}
                <div class="subline">Bewertung (Vergleich): {d.score}/10</div>
                {/if}
            {/each}
            </ul>
        </div>
        {/if}
  
      {#if anmerkungen}
        <div class="section">
          <h3 class="section-title">Anmerkungen</h3>
          <p class="prose">{anmerkungen}</p>
        </div>
      {/if}
    </section>
  {/if}
  
  <style>
    .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 999; }
    .panel { position: fixed; left: 0; right: 0; bottom: 0; height: 80vh; background: #fff; border-top-left-radius: 16px; border-top-right-radius: 16px; box-shadow: 0 -10px 30px rgba(0,0,0,.2); z-index: 1000; overflow: auto; padding: 1rem 1rem 2.5rem; }
    .close { position: absolute; right: .75rem; top: .5rem; font-size: 1.5rem; line-height: 1; background: transparent; border: 0; cursor: pointer; }
    .chip { font-size: .75rem; padding: .125rem .5rem; border-radius: 999px; background: #eef2ff; color: #3730a3; }
    .chip-muted { font-size: .75rem; padding: .125rem .5rem; border-radius: 999px; background: #f3f4f6; color: #374151; }
    .item { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f3f4f6; padding: .25rem 0; }
    .label { font-size: .85rem; color: #6b7280; }
    .value { font-weight: 500; }
    .icon { width: 1.25rem; height: 1.25rem; stroke-width: 2; }
    .section { margin-top: 1rem; border-top: 1px solid #f3f4f6; padding-top: .75rem; }
    .section-title { font-weight: 600; margin-bottom: .5rem; }
    .prose { white-space: pre-wrap; line-height: 1.5; }
  </style>
  