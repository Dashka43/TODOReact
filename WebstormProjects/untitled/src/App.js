import React, {useState} from 'react';
import TaskForm from "./components/TaskForm";
import {STATUSES, PRIORITIES} from "./components/Constants";

import TaskList from "./components/TaskList";
import Select from "./components/UI/select/Select";

function App() {

    const [tasks, setTasks] = useState([])
    const [selectedTasks, setSelectedTasks] = useState([...tasks])

    const [doneSelect, setDoneSelected] = useState('')
    const [favSelect, setFavSelected] = useState('')
    const [priSelect, setPriSelected] = useState('')

    const createTask = (newTask) => {
        setTasks([...tasks, newTask])
        sortAndFilter([...tasks, newTask])

    }

    const removeTask = (task) => {
        setTasks(tasks.filter(t => t.id !== task.id))
        sortAndFilter(tasks.filter(t => t.id !== task.id))

    }

    const favoriteTask = (task) => {
        task.is_favourite = !task.is_favourite
        tasks[tasks.findIndex(t => t.id === task.id)] = task
        setTasks([...tasks])
        sortAndFilter([...tasks])
    }

    const doneTask = (task) => {
        if (task.status == STATUSES.DONE) {
            task.status = STATUSES.TODO;
        } else {
            task.status = STATUSES.DONE
        }
        tasks[tasks.findIndex(t => t.id === task.id)] = task
        setTasks([...tasks])

        sortAndFilter([...tasks])
    }

    const changeTask = (task) => {
        if (task.status == STATUSES.TODO) {
            let text = document.getElementById("text").value
            if (text) {
                task.text = text
                tasks[tasks.findIndex(t => t.id === task.id)] = task
            }
            setTasks([...tasks])
            sortAndFilter([...tasks])
        }
    }

    const setFilters = (select, id, callback) => {
        if (id == 'doneSelect') setDoneSelected(select)
        if (id == 'favSelect') setFavSelected(select)
        if (id == 'priSelect') setPriSelected(select)
        // callback([...tasks])
        setTimeout(callback, 500, [...tasks]);

    }
    const sortAndFilter = (tasks_) => {
        let renderList = []
        renderList = [...tasks_]
        renderList.sort((item1, item2) => {
            if (item1.status == item2.status) {
                if (item1.priority == item2.priority) {
                    if (item1.is_favourite == item2.is_favourite) {
                        return item2.date - item1.date
                    }
                    return item1.is_favourite ? 1 : -1
                }
                return (item1.priority == PRIORITIES.RED || (item1.priority == PRIORITIES.YELLOW && item2.priority == PRIORITIES.GREEN)) ? -1 : 1
            }
            return item1.status == STATUSES.TODO ? -1 : 1
        });


        if (doneSelect !== '') {
            renderList = renderList.filter((item) => {

                return item.status === +doneSelect
            })
        }
        /*
        if(favSelect !== '') {
            renderList = renderList.filter((item) => {
                return item.is_favourite === +favSelect
            })
        }

        if(priSelect !== '') {
            renderList = renderList.filter((item) => {
                return item.priority === +priSelect
            })
        }

         */

        setSelectedTasks(renderList)
    }


    return (
        <div className="App">
            <TaskForm create={createTask}/>
            <div>

                <Select
                    value={doneSelect}
                    sortAndFilter={sortAndFilter}
                    id='doneSelect'
                    onChange={setFilters}
                    options={[
                        {value: '', name: 'Все'},
                        {value: 1, name: 'Завершенные'},
                        {value: 0, name: 'Незавершенные'},
                    ]}

                />
                <Select
                    value={favSelect}
                    id='favSelect'
                    onChange={setFilters}
                    sortAndFilter={sortAndFilter}
                    options={[
                        {value: '', name: 'Все'},
                        {value: 1, name: 'Избраные'},
                        {value: 0, name: 'Неизбраные'},
                    ]}

                />
                <Select
                    value={priSelect}
                    id='priSelect'
                    sortAndFilter={sortAndFilter}
                    onChange={setFilters}
                    options={[
                        {value: '', name: 'Все'},
                        {value: 3, name: 'Высокий'},
                        {value: 2, name: 'Средний'},
                        {value: 1, name: 'Низкий'},
                    ]}

                />
            </div>
            <TaskList done={doneTask} favourite={favoriteTask} change={changeTask} remove={removeTask}
                      tasks={selectedTasks}/>
        </div>
    )
}

export default App;