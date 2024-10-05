<script>
	import { pageInfo, Tasks, addTask, notificationsMsg, addTaskToApi, userId, getTasks } from './store.js';
    import Notification from './components/notification.svelte';
    import { onMount } from 'svelte';
	import Showid from './components/showid.svelte';

    let dummyId = '';
    $: showId = false

    async function generateUserId() {
        let users;
        let genUserId;
        let response = await fetch('http://127.0.0.1:8000/getUsers')
        if (response.ok){
            users = await response.json()
        }
        do{
            genUserId = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
        } while(users.includes(genUserId))

        console.log(`Random id : ${genUserId}`)
        return genUserId

    }

    async function handleAdd(){
        await addTask($userId)
        getTasks($userId)
        $pageInfo.page = 'addPage'
        $pageInfo.detail = 0
        console.log($pageInfo.detail)
    }

    async function handleSearchDb() {
        let users;
        for (let task of $Tasks){
            task.notifObject = {}
        }
        let response = await fetch('http://127.0.0.1:8000/getUsers')
        if (response.ok){
            users = await response.json()
        }
        if (!users.includes(dummyId)){
            alert("This users does not exist. Create a new user.")
        }else{
            $userId = dummyId
            getTasks($userId)
        }
        
    }

    async function handleCreateUser() {
        let randomInt = await generateUserId()
        let t;
        let url = `http://127.0.0.1:8000/createUser/${randomInt}`
        let response = await fetch(url)
        if (response.ok){
            let t = await response.json()
        }
        userId.set(String(randomInt))
        getTasks($userId)
        showId = true
    }
</script>

<div class="col-12">
    <nav class="" style="background-color: #D9D9D9;">
        <div class="px-5 frame3 d-flex flex-row justify-content-between">
            <i class=" fa fa-bars h1 my-auto text-primary" ></i>
            <div class="userinfo my-auto d-flex flex-row gap-3 align-items-center ">
                <h3 on:click|preventDefault={handleCreateUser} class="btn bg-primary p-1 px-3 fw-bold text-white rounded-pill clickable">Create</h3>
                <div class="w-75 bg-white form-control d-flex flex-row px-0 py-0 rounded-well"><i class="fa fa-user my-auto text-primary p-2"></i>
                    <input bind:value={dummyId} placeholder={$userId} type="text" name="userId" id="userId" class="bg-white p-1 text-dark" style="border: none;"><i on:click={handleSearchDb} class="fa fa-get-pocket text-white bg-primary my-auto p-2 rounded-right clickable"></i></div>
            </div>
            <div class="frame4 d-flex flex-row">
                <p on:click|preventDefault={handleAdd} class=" text-decoration-none m-3 clickable menu-links" >+ Add</p>
                <i on:click={()=> window.location.reload()} class="fa fa-refresh fw-bolder text-primary my-auto h4 clickable"></i>
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

{#if showId}
    <Showid on:closeShowId = {() => showId = false}/>
{/if}

<style>
    .menu-links{
        transition: all 0.5s ease;
    }
    .menu-links:hover{
        font-weight: bold;
        color: #0094FF;
    }
    .p-right{
        padding-right: 0px;
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

    #userId:focus{
        border: none;
        outline-width: 0;
    }

    .rounded-well{
        border-radius: 1rem;

    }

    .rounded-right{
        border-radius: 0px;
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;

    }
</style>