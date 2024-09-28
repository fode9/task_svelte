import { writable } from "svelte/store";


export const Tasks = writable([
])
export const pageInfo = writable({
    detail: 0,
    page : 'viewPage' 
})

const taskModel = {
    id: 0,
    day: 'Day',
    date: "2024-09-26",
    name: 'Today',
    created: '',
    notify: false

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
    Tasks.subscribe((value) => {console.log(value.indexOf(newTask))})
    return newTask
    }

