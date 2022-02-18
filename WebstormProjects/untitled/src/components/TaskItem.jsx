import React from 'react';
import Button from "./UI/button/Button";
import {STATUSES} from "./Constants";
import './style.css'

const TaskItem = (props) => {
    let date = new Date(props.task.date).toString()
    return (
        <div className="post">
            <div className="text">
                <p className="completed">{date}</p>
                <div className="buttonwrapper">

                    <Button
                        onClick={() => props.done(props.task)}>{props.task.status == STATUSES.DONE ? "ADD to TODO" : "DONE"}</Button>
                </div>

                <p>{props.task.text}</p>

            </div>
            <div className="buttons">
                <Button
                    onClick={() => props.favourite(props.task)}>{props.task.is_favourite ? "NOT FAVOURITE" : "FAVOURITE"}</Button>
                <Button onClick={() => props.remove(props.task)}>Delete</Button>
                <Button onClick={() => props.change(props.task)}>Change</Button>
            </div>

        </div>
    );
};

export default TaskItem;