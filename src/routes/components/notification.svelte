<script lang="ts">
	import { notifications, notificationsMsg } from './../store.js';
    import { fade, slide, fly, scale, blur, draw, crossfade } from 'svelte/transition';

    function handleNotifClose(task){
        console.log($notificationsMsg)
        $notificationsMsg = $notificationsMsg.filter(item => item!==task)
    }

    function handleTaskCompleted(task){
        task.notify = false
        const icon = document.getElementById('notif-icon')
        if (icon?.classList.contains('fa-shake')){
            icon.classList.remove('fa-shake')
            icon.classList.replace('text-primary','text-dark')
        }
        $notificationsMsg = $notificationsMsg.filter(item => item!==task)
}
</script>
{#if $notificationsMsg.length > 0}
    <div class="container position-fixed fixed-top-0 w-50">
        {#each $notificationsMsg as task (task.id)}
            <div transition:scale class="card notification-box rounded shadow bg-white d-flex flex-column gap-3 text-white p-4">
                <i class="h1 fas fa-bell fa-shake text-primary mx-auto"></i>
                <div class="notif-body">
                    <div class="task-name text-dark h2 text-center fw-bold">{task.name}</div>
                    <div class="day-date d-flex flex-row justify-content-between h3">
                        <p>{task.day}</p>
                        <p>{task.date}</p>
                    </div>
                </div>
                <div class="btns d-flex flex-row justify-content-between align-items-center gap-5">
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <h3 on:click|preventDefault={handleNotifClose(task)} class="text-white btn form-control rounded p2 bg-primary">OK</h3>
                    <h3 on:click={handleTaskCompleted(task)} class="text-white btn form-control rounded p2 bg-primary">Completed</h3>

                </div>
                    
            </div>

        {/each}

    </div>
    

{/if}