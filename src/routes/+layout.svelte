<script>
	import { pageInfo, Tasks, addTask, notificationsMsg, addTaskToApi, userId, getTasks } from './store.js';
    import Notification from './components/notification.svelte';
    import { onMount } from 'svelte';



    async function handleAdd(){
        await addTask($userId)
        getTasks($userId)
        $pageInfo.page = 'addPage'
        $pageInfo.detail = 0
        console.log($pageInfo.detail)
    }
</script>

<div class="col-12">
    <nav class="" style="background-color: #D9D9D9;">
        <div class="px-5 frame3 d-flex flex-row justify-content-between">
            <i class=" fa fa-bars h1 my-auto text-primary" ></i>
            <div class="frame4 d-flex flex-row">
                <p on:click={handleAdd} class=" text-decoration-none m-3 clickable menu-links" >+ Add</p>
                <p class=" text-decoration-none m-3 clickable menu-links">Modify</p>
                <p class=" text-decoration-none m-3 clickable menu-links">View</p>
            </div>
        </div>
    </nav>
    {#if $notificationsMsg.length > 0}
        <Notification/>
    {/if}
    <main class="container">
        <slot/>
    </main>
</div>

<style>
    .menu-links{
        transition: all 0.5s ease;
    }
    .menu-links:hover{
        font-weight: bold;
        color: #0094FF;
    }
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