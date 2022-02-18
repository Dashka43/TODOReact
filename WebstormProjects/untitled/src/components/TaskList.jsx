import React from 'react';
import TaskItem from "./TaskItem";

const TaskList = ({favourite, tasks, remove, change, done}) => {

    return (

        <div className="postList">
            {tasks.map((task) =>
                <TaskItem favourite={favourite} remove={remove} change={change} done={done} task={task} key={task.id}/>
            )}

        </div>
    );
};


export default TaskList;