// E:\yongle-bei-3400\金剛經\11796711_38
import {writable ,get} from 'svelte/store';

export const images=writable([]);
export const frames=writable([]);
export const nimage=writable(0);
export const ratio=writable(1);  // width / naturalWidth
export const totalframe=writable(0);
export const dirty=writable(false);
export const pageframe=writable(3);
export const selectedframe=writable(0);
export const fileprefix=writable('');
export const framefile=writable(null);//editing framefile
export const verticalstrip=writable(5);
export const horizontalstrip=writable(17);
export const nanzang=writable(true);
export const showpreview=writable(false);
export const activeimageurl=writable('')
export const swiper=writable(null)
export const rotateangle=writable(0);
export let defaultframe;

export const setTemplate=(name)=>{
    if (name=='beizang') { //山東圖書館 北藏
        defaultframe=function(idx){return [ 1030*(2-idx)+186,139,964,2120]};
        pageframe.set(3);
        verticalstrip.set(5);
    } else if (name=='longzang') {//欽定龍藏
        verticalstrip.set(5);
        pageframe.set(2);
        defaultframe=function(idx){return [ 385*(1-idx)+18,148,364,810]};
    } else if (name=='nanzang') {//山東圖書館南藏
        verticalstrip.set(6);
        pageframe.set(3);
        defaultframe=function(idx){return [ 880*(2-idx)+220,170,790,1822]};
    }
}
setTemplate('beizang');
export const caltotalframe=()=>{
    const imgs=get(images);
    let out=0;
    for (let i=0;i<imgs.length;i++) {
        out+= imgs[i].frames?.length||0
    }
    return out;
}

export const resizeframe=(frame,ratio)=>{
    const [x,y,w,h]=frame;
    return [x*ratio,y*ratio,w*ratio,h*ratio];
}
export const selectimage=(n)=>{
    const imgs=get(images);
    const nimg=get(nimage);
    const frms=get(frames);
    const r=get(ratio);

    if (imgs?.length && imgs[nimg]) {
        imgs[nimg].frames=frms.map( f=>resizeframe(f,1/r) ) ;
        imgs[nimg].rotate=get(rotateangle);
        dirty.set(true);
    }
    totalframe.set( caltotalframe())
    nimage.set(n);
    rotateangle.set(imgs[n]?.rotate||0);
    if (get(totalframe)) selectedframe.set(0);
}
export const genjson=()=>{
    const imgs=get(images);
    const out=[];
    for (let i=0;i<imgs.length;i++) {
        const frames=[];
        const rotate=imgs[i].rotate||0;
        const mark=imgs[i].mark||0;
        for (let j=0;j<imgs[i].frames?.length||0;j++) {
            const [x,y,w,h]=imgs[i].frames[j];
            frames.push([Math.round(x),Math.round(y),Math.round(w),Math.round(h)]);
        }
        out.push(  '{"name":"'+imgs[i].name+'","frames":'+JSON.stringify(frames)+
        (rotate?',"rotate":'+rotate:'')+(mark?',"mark":'+mark:'')+"}" );
    }
    return '['+out.join(',\n')+']';
}

export async function getImageURL (images,nimg, store) {
    if (!images?.length) return;
    const item = images[nimg]; //nimg cannot be zero
    if (!item) return;
    if (item.zip) {
        imageurl = URL.createObjectURL(await item.entry.getData(new zip.BlobWriter()));
    } else if (item.pdf) {
        await item.pdf.getPage(item.page).then(async function(page){
            const viewport = page.getViewport({ scale:1});
		    const canvas = document.createElement("canvas")
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({canvasContext: canvas.getContext('2d'),viewport}).promise; 
            imageurl = canvas.toDataURL("image/png");
        });
    } else {
        const imagefile=await item.entry.getFile();
        imageurl= URL.createObjectURL(imagefile);
    }
    if (store) {
        store.set(imageurl);
        setTimeout(()=>{
            const naturalWidth = document.getElementById('image1').naturalWidth;
            height = document.getElementById('image1').height;
            width = document.getElementById('image1').width;
            r=width/naturalWidth;      
            ratio.set(r);
            const frms=(images[nimg].frames||[defaultframe(0),defaultframe(1), defaultframe(2)]).map(f=>resizeframe(f,r));
            frames.set( frms );
        },100);
    }
    return imageurl; 
}
export const togglemark=(idx)=>{
    const arr=[...get(images)];
    arr[idx].mark=1-(arr[idx].mark||0);
    images.set(arr);
}