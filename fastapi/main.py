from fastapi import FastAPI, Path
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import datetime
from typing import Dict
import json


app = FastAPI()

# Define CORS settings
origins = [
    "http://localhost:5173",
    "https://hip-locally-louse.ngrok-free.app"  # Allow your frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

database = [
]


Users_Task = {
    '23' : [],
    '14' : []
}

Notifications = {
    '23' : []
}

try:
    with open('db.json', 'r')as file:
        Users_Task = json.load(file)
except:
    with open('db.json', 'w') as file:
        json.dump(Users_Task, file, indent=4)

'''class addTaskModel(BaseModel):
    user_id : int = None
    task: '''

@app.get('/')
def home():
    return {
        'data':'Informaton' 
    }

@app.get('/get_task_by_user/{user_id}')
def get_task_by_user(user_id : str):
    with open('db.json', 'r') as file:
        Users_Task = json.load(file)

    if user_id in Users_Task.keys():
        print(Users_Task[user_id])
        return Users_Task[user_id]
    else:
        return []
    

@app.post('/task_manager')
def add_task(item : Dict):
    with open('db.json', 'r')as file:
        Users_Task = json.load(file)

    if item['event'] == "create":
        print(item['task'])
        Users_Task[item["user_id"]].insert(0,item["task"])
        with open('db.json', 'w')as file:
            json.dump(Users_Task, file, indent=4)
            print("Sucessful dump")
        return {
            'Tasks':Users_Task[item['user_id']],
            'task': item['task']}
    if item['event'] == "direct_update":
        for task in Users_Task[item["user_id"]]:
            if task['id'] == item['task']['id']:
                index = Users_Task[item["user_id"]].index(task)
                Users_Task[item["user_id"]][index] = item['task']
        with open('db.json', 'w')as file:
            json.dump(Users_Task, file, indent=4)
            print("Sucessful dump")

    if item['event'] == 'delete_task':
        del Users_Task[item["user_id"]][Users_Task[item['user_id']].index(item['task'])]
        print(Users_Task[item["user_id"]])
        with open('db.json', 'w')as file:
            json.dump(Users_Task, file, indent=4)
            print("Sucessful dump")


@app.get('/getUsers')
def getUsers():
    with open('db.json', 'r')as file:
        Users_Task = json.load(file)

    return list(Users_Task.keys())


@app.get('/createUser/{userId}')
def createUser(userId):
    with open('db.json', 'r')as file:
        Users_Task = json.load(file)

    #ADD NEW USER TO USERS TASK
    Users_Task[userId] = []

    with open('db.json', 'w')as file:
            json.dump(Users_Task, file, indent=4)
            print("Sucessful dump")
    return str(userId)

