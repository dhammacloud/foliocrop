<script>
import {dirty,selectimage,genjson, pageframe,defaultframe, 
    selectedframe,resizeframe,images, frames,nimage,ratio,totalframe}from './store.js'
import {createBrowserDownload} from 'ptk/platform/chromefs.ts'
const {ZipReader,BlobReader} = zip;//need https://gildas-lormeau.github.io/zip.js/demos/lib/zip.min.js 
const previmage=()=>{
    let n=$nimage;
    n--;
    if (n<0) n=0;
    selectimage(n);
}
const pickerOpts = {
  types: [
    {
      description: "Zip",
      accept: {
        "zip/*": [".zip"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};

let fileprefix='noname';
const sortfilename=(a,b)=>{
    if (parseInt(a)&& parseInt(b)) {
        return parseInt(a) -  parseInt(b);
    } else {
        return a.name>b.name?1:-1;
    }
}
async function getDir() {
  const dirHandle = await window.showDirectoryPicker();
  const out=[];
  for await (const entry of dirHandle.values()) {
    if (entry.kind=='file' &&(entry.name.endsWith('.png')|| entry.name.endsWith('.jpg'))) {
        out.push({entry, name:entry.name,frames: out.length?null:[] }); // set first image has no frame
    }
  }
  out.sort(sortfilename );
  nimage.set(0);
  images.set(out);
  fileprefix=dirHandle.name;
}
async function getZip(){
    const filehandles = await window.showOpenFilePicker(pickerOpts);
    const file =await filehandles[0].getFile();
    const zip= new ZipReader(new BlobReader(file));
    const entries=await zip.getEntries();
    const out=[];
    entries.forEach( entry =>{    
        if (entry.filename.endsWith('.jpg')) {
            const at=entry.filename.lastIndexOf('/');
            out.push({name:entry.filename.slice(at+1), entry, zip, frames: out.length?null:[]});
        }
    })
    out.sort(sortfilename );
    nimage.set(0);
    images.set(out);
    fileprefix=file.name;
}
const nextimage=()=>{
    let n=$nimage;
    n++;
    if (n>=$images?.length) n=$images?.length-1;
    selectimage(n);
}

function handleFrameMove (evt) {
    const key=evt.key.toLowerCase();
    const alt=evt.altKey;
    const ctrl=evt.ctrlKey;
    let dy=0,dx=0;
    if (key=='arrowup') dy=-1;
    if (key=='arrowdown') dy=1;
    if (key=='arrowleft') dx=-1;
    if (key=='arrowright') dx=1;

    if (alt) {dx*=1;dy*=1;}
    else if (ctrl) {dx*=5;dy*=5;}
    else {dx*=2.5;dy*=2.5;}
    const frms=$frames;
    const sel=$selectedframe;
    for (let i=0;i<frms.length;i++) {
        let [x,y,w,h]=frms[i];
        x+=dx; y+=dy;
        if ( (1<<i)&sel || !sel) { //move all frame if no selected
            frms[i]=[x,y,w,h];
        }
    }
    frames.set(frms);
}
function handleKeydown(evt) {
    const key=evt.key.toLowerCase();
    const alt=evt.altKey;
    if (key=='f5') {//prevent refresh accidently
        evt.preventDefault();
        return;
    }
    if (evt.srcElement.nodeName=='INPUT' || evt.srcElement.nodeName=='TEXTAREA'
    || evt.srcElement.nodeName=='BUTTON') return;

    if (alt && key=='n') nextimage();
    else if (alt && key=='p') previmage();
    else if (alt && key=='o'&&!$dirty) getDir();
    else if (alt && key=='s'&& $dirty) save();
    else if (key=="arrowdown" || key=="arrowup" ||key=="arrowright" || key=="arrowleft") handleFrameMove(evt);
}

const save=()=>{
    selectimage(0);//make sure all frame is saved
    const data=genjson();
    dirty.set(false);
    const outfn=fileprefix+ '.json';
    createBrowserDownload(outfn,data);
}
const reset=()=>{
    const frms=[];
    const r=$ratio;
    for (let i=0;i<$pageframe;i++) {
        frms.push(defaultframe(i));
    }
    frames.set( frms.map(f=>resizeframe(f,r)) );
}
const deleteframe=()=>{
    const frms=$frames;
    frms.pop();
    frames.set(frms);
    selectedframe.set(0);
}
</script>
<svelte:window on:keydown={handleKeydown}/>
<button title="Alt O, Open Folder" disabled={$dirty} on:click={getDir}>📁</button>
<button title="Alt Z, Open Zip" disabled={$dirty} on:click={getZip}>Zip</button>
<button title="Alt S, Save" disabled={!$dirty} on:click={save}>💾</button>
<!-- <button on:click={previmage}>Prev</button> -->
<!-- <button title="Alt N" on:click={nextimage}>下個</button> -->
<br/><button title="Alt R" on:click={reset}>♻️</button>
<button title="Alt D" on:click={deleteframe}>➖</button>
{$totalframe}

