import { writable } from "svelte/store"


export const Tasks = writable([
])
export const pageInfo = writable({
    detail: 0,
    page : 'viewPage' 
})



let permissionGranted = false

// Function to request permission for notifications
export function requestNotificationPermission() {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        permissionGranted = true;
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            permissionGranted = true;
          }
        });
      }
    }
  }

const taskModel = {
    id: 0,
    day: 'Day',
    date: "2024-09-26",
    name: 'Today',
    created: new Date().toISOString(),
    note: '',
    notify: false

}

export let notifications = []

export let userId = writable(23)

export let notificationsMsg = writable([])

function convertToTimeZone(date, timeZoneOffsetMinutes) {
    date = new Date(date)
    // Get the UTC time by adjusting with the local timezone offset
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  
    // Adjust the time with the desired timezone offset (in minutes)
    const targetTime = new Date(utcTime + timeZoneOffsetMinutes * 60000);
  
    return targetTime;
  }


export async function getTasks(user_id = 23){
    let url = 'http://127.0.0.1:8000/get_task_by_user/'+String(user_id)
    let response = await fetch(url)
    if (response.ok){
        let t = await response.json()
        console.log(t)
        Tasks.set(t)
        console.log('Tasks Fetched')
    }
}


export async function addTaskToApi(userId = 23, task= {...taskModel, id:assignId()}){
    let url = 'http://127.0.0.1:8000/task_manager'
    let data = {
        user_id  : userId,
        task: task,
        event: 'create'    
    }
    let response = await fetch(url, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body :JSON.stringify(data)
    })

    if (response.ok){
        let t = await response.json()
        console.log(t)
        Tasks.set(t.Tasks)
        console.log(t)
        return t.task
    }else{
        throw new Error('This task couldnt be loaded unto existing task!')
    }
}


function checkAndNotify(task){
    let deadlineMet = false
    let notification;
    if (!deadlineMet){
        let nlist =[]
        notificationsMsg.subscribe(value => {nlist = value} )
        if (!nlist.includes(task)){
            console.log(`${new Date().toISOString().slice(0,16)} : ${convertToTimeZone(task.date, 60).toISOString().slice(0,16)}`)
            if (new Date().toISOString().slice(0,16) === convertToTimeZone(task.date, 60).toISOString().slice(0,16)){
                deadlineMet = true
                notification = {

                }
                {notificationsMsg.update((arr) => [...arr, task])}
                console.log('logically Notifiied')
            }
        }
    }

    return {
        'task' : task,
        'fullfilled' : new Date().toISOString()
    }

}

async function NotificationHandler(task) {
    console.log('Notification Hnadle')
    let interval = setInterval(() => {
        if (notifications.includes(task) && !task.notify){
            notifications.filter(item => item !== task)
            clearInterval(interval)
        }
        let nlist =[]
        notificationsMsg.subscribe(value => {nlist = value} )
        if (!notifications.includes(task) && task.notify && !nlist.includes(task) ){
            notifications = [...notifications, {task}]
            let check = checkAndNotify(task)
        }
    }, 10000);
    

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}


const assignId = () => {
    let genId;
    // Use the store value directly to get the current list of IDs
    Tasks.update(tasks => {
        let ids = tasks.map(task => task.id);
        do {
            genId = getRandomInt(0, 999);
        } while (ids.includes(genId));

        return tasks; // Return the current tasks (required by update)
    });

    return genId;
}

export async function addTask(userId) {
    let newTask = {...taskModel, id:assignId()}
    console.log('newTask', newTask)
    newTask = await addTaskToApi(userId, newTask)
    let n = NotificationHandler(newTask)
    return newTask
}
