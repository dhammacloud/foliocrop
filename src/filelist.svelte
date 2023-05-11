<script>
import {nimage,images,selectimage} from './store.js'

</script>
<div class="filelist">
{#key $nimage}
{#each $images as image,idx}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class:selected={idx==$nimage} on:click={()=>selectimage(idx)}>
    <span class:done={image.frames}>{image.name}</span> <span>{image.frames?.length||''}</span></div>
{/each}
{/key}
</div>
<style>
.done {color:yellowgreen}
.filelist {cursor:pointer;overflow-y: auto; height: 94vh;}
.selected {background-color: rgb(72, 72, 72);}

</style>