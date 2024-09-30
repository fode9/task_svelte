<script>
import { fade, slide, fly, scale, blur, draw, crossfade } from 'svelte/transition';
import Scripts from './scripts.svelte';
import {createEventDispatcher, onMount} from 'svelte'
import { Tasks } from '../store';
export let taskId = 0

let task = $Tasks[taskId]

$: date = task.date; // To store the selected date
$: dayOfWeek = ''; // To store the day of the week
let closed = false
const dispatch = createEventDispatcher()

onMount(() => {
    getDayFromDate()
})

console.log(task)
// Function to get the day from the selected date
function getDayFromDate() {
    if (date) {
        const selectedDate = new Date(date);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        dayOfWeek = days[selectedDate.getDay()]; // Get the day index and map it to the name of the day
    }
}

function handleSubmit(){
    task.day = dayOfWeek
    task.date = date
    handleClickBackdrop()
}
function handleClickBackdrop(){
    closed = !closed
    if (closed){
        dispatch('backdropClicked', 'viewPage')
    }
}

</script>

<div class="">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div transition:scale on:dblclick={handleClickBackdrop} class="backdrop">
        <div class="col-12 d-flex justify-content-center align-items-center vh-100">
            <form class="main-mod-frame p-4 my-auto shadow">
                <div class="p-2 d-flex flex-row justify-content-between gap-5">
                    <input type="text" bind:value={task.name} class="form-control" placeholder={task.name}>
                    <input type="date" on:change={getDayFromDate} placeholder={task.date} class="form-control" bind:value={task.date}>
                </div>
                <div class="p-2 d-flex flex-row justify-content-between mt-4">
                    <h3 class="h3 fw-bold text-primary">{dayOfWeek}</h3>
                    <i id={String(task.id)} on:click={() => task.notify = !task.notify} class={task.notify ?  'h3 fas fa-bell fa-shake clickable text-primary' : 'h3 fa fa-bell clickable'}></i>
                </div>
                <div class="p-2 d-flex flex-row justify-content-between gap-5">
                    <textarea name="note" id="note" class="form control w-75 p-2" rows="6" bind:value={task.note}></textarea>
                </div>
                <div class="p-2">
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <p on:click|preventDefault={handleSubmit} class="btn rounded-pill bg-primary text-white">Done</p>
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <p on:click|preventDefault={handleClickBackdrop} class="btn rounded-pill bg-primary text-white">Cancel</p>
                </div>
            </form>
        </div>
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
