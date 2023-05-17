<script>
    //https://github.com/idris-maps/svelte-parts/blob/master/src/lib/DropFile.svelte
  import FallbackSvg from './dropfilefallbacksvg.svelte'

  export let multiple= false
  export let disabled = false
  export let onDrop
  export let onEnter
  export let onLeave

  let isOver = false
  let input

  const handleEnter = () => {
    isOver = true
    if (onEnter) {
      onEnter()
    }
  }

  const handleLeave = () => {
    isOver = false
    if (onLeave) {
      onLeave()
    }
  }

  const handleDrop = e => {
    e.preventDefault()

    if (!e?.dataTransfer?.items || disabled) {
      return
    }
    const items = Array.from(e.dataTransfer.files)
    onDrop(items)
    isOver = false
  }

  const handleDragOver = e=> {
    e.preventDefault()
  }

  const handleChange = e=> {
    e.preventDefault()
    const files=e.target.files
    onDrop(Array.from(files))
  }

  const onClick = () => {
    input.click()
  }

  const onKeyDown = e => {
    if (e.key === 'Enter') {
      input.click()
    }
  }
</script>

<div
  id="zone"
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  on:dragenter={handleEnter}
  on:dragleave={handleLeave}
  on:click={onClick}
  on:keydown={onKeyDown}
  tabIndex={0}
>
  <slot>
    <div id="fallback">
      <FallbackSvg over={isOver} />
    </div>
  </slot>
</div>
<input
  id="hidden-input"
  type="file"
  on:change={handleChange}
  bind:this={input}
  {multiple}
  {disabled}
/>

<style>
  #zone {
    width: 100%;
    height: 100%;
  }
  #hidden-input {
    display: none;
  }
  #fallback {
    display: grid;
    align-items: center;
    width: 100%;
    height: 100%;
    border: black solid 1px;
    border-radius: 5px;
    border-style: dashed;
    border-color: inherit;
  }
  #fallback :global(svg) {
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>