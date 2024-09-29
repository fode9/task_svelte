import { writable } from "svelte/store";
import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications'


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
    notify: false

}

export let notifications = []

export let notificationsMsg = writable([])

function checkAndNotify(task){
    let deadlineMet = false
    let notification;
    if (!deadlineMet){
        let nlist =[]
        notificationsMsg.subscribe(value => {nlist = value} )
        if (!nlist.includes(task)){
            if (new Date().toISOString().slice(0,10) === task.date){
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

export const addTask = () => {
    let newTask = {...taskModel, id:assignId()}
    Tasks.update(arr => [newTask, ...arr]);
    let n = NotificationHandler(newTask)
    return newTask
    }

