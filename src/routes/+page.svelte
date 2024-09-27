<script lang="ts">
	import { page } from "$app/stores";
import Layout from "./+layout.svelte";
	import Modify from "./components/modify.svelte";
    import {Tasks} from './store'
    import { fade, slide, fly, scale, blur, draw, crossfade } from 'svelte/transition';


const taskModel = {
    id: 0,
    day: 'Day',
    date: "2024-09-26",
    name: 'Today',
    created: '',
    notify: false

}

$: pageInfo = {
    detail: 0,
    page : 'viewPage' 
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}


const assignId = () => {
    let ids = []
    for (let i =0; i<$Tasks.length; i++){
        ids.push($Tasks[i].id)
    }
    let genId = getRandomInt(0,999)
    while (ids.includes(genId)){
        genId = getRandomInt(0,999)
    }
    return genId
}

const addTask = () => {
    let newTask = {...taskModel}
    $Tasks = [newTask,...$Tasks]
    $Tasks[0].id = assignId()
    return newTask
    }
    
const deleteTask = (task) => {
    $Tasks = $Tasks.filter(item => item !== task)
}

</script>

{#if pageInfo.page === 'viewPage'}

    <div class="col-12 d-flex flex-column container">
        <div class="row align-items-center d-flex justify-content-center">
            <div class="mx-auto p-5 logo d-flex flex-column justify-content-center align-items-center">
                <img src="/logo.svg" alt="" class="mx-auto" style="width: 200px;">
            </div>
        </div>
        <div class="row task-row d-flex flex-column">
            <div class="description h4" style="border-bottom: 2px solid #0094FF;">Tasks</div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <p on:click|preventDefault={addTask} class="fw-bolder text-center btn mx-auto mt-4 rounded-circle p-2 d-flex justify-content-center align-items-center" id="add-btn" style="width: 50px; height: 50px; font-size: 24px; line-height: 1;"><i class="fas fa-plus"></i></p>
            <div class="tasks d-flex flex-column gy-4">
                {#if $Tasks.length === 0}
                    <p class="text-center">There are no task added yet. Click on the <strong class="fw-bold text-primary h3 d-inline">+</strong> button to add a task! </p>
                {/if}
                {#each $Tasks as task (task.id)}
                    <div transition:scale class="shadow task-card row mb-5 p-4 rounded d-flex flex-column" style="background-color: #D9D9D9;">
                        <div class="text-primary h4 task-top d-flex justify-content-between px-2">
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <i on:click|preventDefault={() => {pageInfo.page = 'modifyPage'; pageInfo.detail = $Tasks.indexOf(task) }} class="fa fa-gear close-task clickable"></i>
                            <i on:click|preventDefault={deleteTask(task)}  class="fa fa-close set-task clickable"></i>
                        </div>
                        <div class="task-date text-center p-4">
                            <p class="h3 text-primary fw-bold">{task.day}</p>
                            <p class="h6 text-dark">{task.date}</p>
                        </div>
                        <div class="task-bottom mb-0 h4 d-flex justify-content-between px-2">
                            <div class="d-flex w-50 gap-3">
                                <i class="fa fa-maximize my-auto"></i>
                                <p class="date-describe fw-bold m-0">{task.name}</p>
                            </div>
                            <i on:click={() => task.notify = !task.notify} class={task.notify ? 'fas fa-bell fa-shake clickable text-primary' : 'fa fa-bell clickable'}></i>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <div class="row"></div>
    </div>

{:else if pageInfo.page === 'modifyPage'}
    <Modify taskId = {pageInfo.detail} on:backdropClicked={(e) => {pageInfo.page = e.detail}}></Modify>
{:else }
    <p>Not a Page</p>

{/if}


<style>
    .clickable{
        cursor: pointer;
        transition: all 0.5s ease;
    }

    #add-btn:hover{
        transition: all 0.5s ease;
        background-color: #0094FF;
        color: white;
    }

    #add-btn{
        background-color: #D9D9D9;
        color: #0094FF;
    }
</style>