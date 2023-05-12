<script>
import Toolbar from './toolbar.svelte';
import ImageViewer from './imageviewer.svelte';
import FileList from './filelist.svelte';
import Thumbnail from './thumbnail.svelte';
</script>

<table><tr>
    <td class="FileList"><Toolbar/><FileList/></td>
    <td class="Thumbnail"><Thumbnail/></td>    
    <td class="ImageViewer"><ImageViewer/></td>
</tr></table>

<style>
    .ImageViewer {width:80%;vertical-align: top;}
    .FileList {width:17% ;vertical-align: top;}
    .Thumbnail { vertical-align: top}
</style>