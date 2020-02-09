/**
 * Util functions, constants, etc.
 */

import { DateTime } from 'luxon';

const lsKey = 'task-planner';

const serializeDate = (date) => {
    if (date == null) {
        return date;
    }

    if (typeof date === 'string') {
        return date;
    } else {
        return DateTime.fromJSDate(date).toISO();
    }
};

export const $ = (query) => document.querySelector(query);

export function getTasks() {
    const tasks = JSON.parse(localStorage.getItem(lsKey)) || [];

    return tasks.map((task) => {
        const dow = task.extendedProps.daysOfWeek === '' ? undefined : dow;

        return Object.assign(task, {
            daysOfWeek: dow,

            startTime: dow != null && !task.allDay ?
                DateTime.fromISO(task.start).toFormat('HH:mm:ss') : undefined,

            endTime: dow != null && !task.allDay && task.end != null ?
                DateTime.fromISO(task.end).toFormat('HH:mm:ss') : undefined,
        });
    });
};

export function serializeTasks(tasks) {
    const keys = ['title', 'start', 'end', 'allDay', 'extendedProps', 'classNames', 'groupId'];

    const formatted = tasks.map((task) => {
        const formattedTask = {};

        keys.forEach((key) => {
            formattedTask[key] = task[key];
        });

        return Object.assign(formattedTask, {
            classNames: formattedTask.classNames.filter((cls) => cls !== 'task-selected'),
            start: serializeDate(formattedTask.start),
            end: serializeDate(formattedTask.end),
        });
    });

    return JSON.stringify(formatted);
}

export function saveTasks(tasks) {
    const serialized = serializeTasks(tasks);
    localStorage.setItem(lsKey, serialized);
}

export function remove(array, value) {
    array.splice(array.indexOf(value), 1);
}
