<script lang="ts">
	import { NotificationDisplay } from '@beyonk/svelte-notifications';
	import { page } from "$app/stores";
	import { onMount } from "svelte";
    import Layout from "./+layout.svelte";
	import Modify from "./components/modify.svelte";
    import Add from './components/add.svelte';
    import {Tasks, pageInfo, requestNotificationPermission, getTasks, userId, updateTask} from './store'
    import {addTask} from './store'
    import { fade, slide, fly, scale, blur, draw, crossfade } from 'svelte/transition';


    if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  }

    onMount(() => {
        getTasks($userId)
        requestNotificationPermission()
        window.focus()
    })
    

    async function handleNotify(task){
        task.notify = !task.notify
        task.notifObject = {}
        updateTask(task,$userId)
        getTasks($userId)
        let ico = document.getElementById(String(task.id))
        if (task.notify === true){
            task.notifObject.startNotif()
            ico.className = 'fa fa-bell fa-shake text-primary h4'
        }else{
            ico.className = 'fa fa-bell text-dark h4'
        }
    }

    function onLoadNotif(task){
        const ico = document.getElementById(String(task.id))
        let className;
        if (task.notify === true){
            className = "fa fa-bell fa-shake text-primary h4"
            return className
        }else{
            className ="fa fa-bell text-dark h4"
            return className
        }

    }

    async function deleteTask(task){
        let url = 'http://127.0.0.1:8000/task_manager'
        task.notifObject = {}
        let data = {
            user_id  : $userId,
            task: task,
            event: 'delete_task'    
        }
        let response = await fetch(url, {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        if  (response.ok){
            console.log('Delete Successful')
            getTasks($userId)
        }
    }

</script>

{#if $pageInfo.page === 'viewPage'}

    <div class="col-12 d-flex flex-column container">
        <div class="row align-items-center d-flex justify-content-center">
            <div class="mx-auto p-5 logo d-flex flex-column justify-content-center align-items-center">
                <img src="/logo.png" alt="" class="mx-auto" style="width: 200px;">
            </div>
        </div>
        <div class="row task-row d-flex flex-column">
            <div class="description h4" style="border-bottom: 2px solid #0094FF;">Tasks</div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <p on:click|preventDefault={addTask($userId)} class="fw-bolder text-center btn mx-auto mt-4 rounded-circle p-2 d-flex justify-content-center align-items-center" id="add-btn" style="width: 50px; height: 50px; font-size: 24px; line-height: 1;"><i class="fas fa-plus"></i></p>
            <div class="tasks d-flex flex-column gy-4">
                {#if $Tasks.length === 0}
                    <p class="text-center">There are no task added yet. Click on the <strong class="fw-bold text-primary h3 d-inline">+</strong> button to add a task! </p>
                {/if}
                {#each $Tasks as task (task.id)}
                    <div transition:scale class="shadow task-card row mb-5 p-4 rounded d-flex flex-column" style="background-color: #D9D9D9;">
                        <div class="text-primary h4 task-top d-flex justify-content-between px-2">
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <i on:click|preventDefault={() => {$pageInfo.page = 'modifyPage'; $pageInfo.detail = $Tasks.indexOf(task) }} class="fa fa-gear close-task clickable"></i>
                            <i on:click|preventDefault={deleteTask(task)}  class="fa fa-close set-task clickable"></i>
                        </div>
                        <div class="task-date text-center p-4">
                            <p class="h3 text-primary fw-bold">{task.day}</p>
                            <p class="h6 text-dark">{task.date.slice(0,10)}</p>
                        </div>
                        <div class="task-bottom mb-0 h4 d-flex justify-content-between px-2">
                            <div class="d-flex w-50 gap-3">
                                <i class="fa fa-maximize my-auto"></i>
                                <p class="date-describe fw-bold m-0">{task.name}</p>
                            </div>
                            <i class={onLoadNotif(task)} on:click|preventDefault={handleNotify(task)} id={String(task.id)}></i>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <div class="row"></div>
    </div>

{:else if $pageInfo.page === 'modifyPage'}
    <Modify taskId = {$pageInfo.detail} on:backdropClicked={(e) => {$pageInfo.page = e.detail;}}></Modify>

{:else if $pageInfo.page === 'addPage'}
    <Add taskId = {$pageInfo.detail} on:backdropClicked={(e) => {$pageInfo.page = e.detail;}}></Add>    
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