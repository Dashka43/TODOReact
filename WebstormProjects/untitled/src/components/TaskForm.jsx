import React, {useState} from 'react';
import Input from "./UI/input/Input";
import Button from "./UI/button/Button";
import Select from "./UI/select/Select";

import {STATUSES} from "./Constants";

const TaskForm = ({create}) => {

    const [task, setTask] = useState({
        text: '', status: STATUSES.TODO,
        is_favourite: false, is_deleted: false
    })
    const addNewTask = (e) => {
        e.preventDefault()
        let time = (new Date()).getTime();
        const newTask = {
            ...task, id: Math.random().toString(36).substring(2) + time,
            date: time
        }
        create(newTask)

        setTask({
            text: '', status: STATUSES.TODO,
            is_favourite: false,
            is_deleted: false
        })

    }

    const selectPriority = (select) => {
        setTask({...task, priority: select})
    }
    return (

        <form>
            <Input
                type="text"
                id="text"
                value={task.text}
                onChange={e => setTask({...task, text: e.target.value})}
                placeholder="post text"/>
            <Select
                value={task.priority}
                onChange={selectPriority}
                options={[
                    {value: '3', name: 'Высокий'},
                    {value: '2', name: 'Средний'},
                    {value: '1', name: 'Низкий'},
                ]}
                defaultValue='3'
            />
            <Button onClick={addNewTask}>Create task</Button>
        </form>
    );
};

export default TaskForm;