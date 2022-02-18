import React from 'react';
import classes from './Select.module.css'

const Select = ({options, onChange, id, sortAndFilter}) => {
    return (
        <select className={classes.select}
                onChange={event => onChange(event.target.value, id, sortAndFilter)}>
            {options.map(option =>
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            )}
        </select>
    );
};

export default Select;