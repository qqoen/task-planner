/**
 * Util functions, constants, etc.
 */

const lsKey = 'task-planner';

export const $ = (query) => document.querySelector(query);

export function getTasks() {
    const tasks = JSON.parse(localStorage.getItem(lsKey)) || [];
    
    return tasks.map((task) => {
        return Object.assign(task, {
            daysOfWeek: task.extendedProps.daysOfWeek,
        });
    });
};

export function saveTasks(tasks) {
    console.log('save', tasks);
    const keys = ['title', 'start', 'end', 'allDay', 'extendedProps', 'classNames'];

    const formatted = tasks.map((task) => {
        const formattedTask = {};

        keys.forEach((key) => {
            formattedTask[key] = task[key];
        });

        return formattedTask;
    });

    localStorage.setItem(lsKey, JSON.stringify(formatted));
}

export function remove(array, value) {
    array.splice(array.indexOf(value), 1);
}
