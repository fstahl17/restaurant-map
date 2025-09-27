<script lang="ts">
    import { APIProvider, GoogleMap, AdvancedMarker, Marker } from 'svelte-google-maps-api';
    import { env } from '$env/dynamic/public';
    import places from '../../src/data.json';
    import OverlayPanel from '$lib/placeInfo.svelte'
    import { onMount } from 'svelte';

    const apiKey = env.PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapId = env.PUBLIC_GOOGLE_MAPS_MAP_ID;

    onMount(async () => {
      const r = await fetch('/.netlify/functions/maps-env');
      const env = await r.json();

      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${env.apiKey}&v=weekly&map_ids=${env.mapId}`;
      document.head.appendChild(s);
    });
  
     // einzelner String
    const libraries = ['marker']; // WICHTIG: AdvancedMarker braucht diese Library

    const mapOptions = {
        center: { lat: 48.21327705958343, lng: 16.36358758074824 },
        zoom: 12,
        mapId: mapId,
        /*
        fullscreenControl: false,
        streetViewControl: false,
        cameraControl: false,
        */
        disableDefaultUI: true
    };

    let locations: any[] = []

    places.forEach(element => {
      locations.push(
        {
          placeId: element['Place Id - Location'],
          position: {lat: element['Latitude - Location'], lng: element['Longitude - Location']}
        }
      )
    });

    let overlayOpen = false;
    let selected: any = null;
  
    function handleMarkerClick(placeId:string) {
      selected = placeId;
      overlayOpen = true;
    }

    function close() { overlayOpen = false; }
  </script>
  
  <div style="height: 100vh; width: 100%;">
    <APIProvider {apiKey} libraries={['marker']}>
      <GoogleMap id="map" options={mapOptions} mapContainerStyle="width: 100%; height: 100%;">
        {#each locations as location}
        <Marker 
            position={location.position} 
            onClick={() => handleMarkerClick(location.placeId)}
        />
        {/each}
      </GoogleMap>
    </APIProvider>

    <OverlayPanel placeId={selected} open={overlayOpen} onClose={close}></OverlayPanel>
  </div>
  