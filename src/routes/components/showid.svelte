<script>
	import { fade, scale } from "svelte/transition";
    import { userId } from "../store";
    import { createEventDispatcher } from "svelte";

    let dispath = createEventDispatcher()
    function handleOk(){
        dispath('closeShowId')
    }

</script>

<div transition:scale  class="backdrop">
    <div class="col-12 d-flex justify-content-center align-items-center vh-100">
        <form class="main-mod-frame p-4 my-auto shadow bg-white col-6">
            <div class="text-center">
                <h2><i class="fa fa-gear pr-2 text-primary"></i> New User Created <i class="fa fa-gear pl-2 text-primary"></i></h2>
                <h1>{$userId}</h1>
            </div>
            
            <div class="p-2 d-flex align-items-center">
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <p on:click={handleOk} class="btn rounded-pill bg-primary text-white w-50 mx-auto"><i class="fa fa-check my-auto h3"></i></p>
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            </div>
        </form>
    </div>
</div>

<style>
    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.2); /* Semi-transparent background */
      backdrop-filter: blur(10px); /* Blur effect */
      z-index: 99; /* High z-index to overlay the entire screen */
    }
    .hidden {
      display: none;
    }
    .not-affected{
        z-index: 9999;
    }
</style>
