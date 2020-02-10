/**
 * Util functions, constants, etc.
 */

import { EventApi } from '@fullcalendar/core';
import { DateTime } from 'luxon';

export interface ISerializedEvent {
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    extendedProps: {
        daysOfWeek: string;
    };
    classNames: string[];
    groupId: string;
}

const lsKey = 'task-planner';

const serializeDate = (date: Date | null) => {
    if (date == null) {
        return date;
    } else {
        return DateTime.fromJSDate(date).toISO();
    }
};

export const $ = (query: string) => {
    const node = document.querySelector(query);

    if (node == null) {
        throw new Error(`Cannot find element by query ${query}`);
    }

    return node as HTMLElement;
};

export function getTasks() {
    const stored = localStorage.getItem(lsKey);
    const tasks: ISerializedEvent[] = stored != null ? JSON.parse(stored) : [];

    return tasks.map((task) => {
        const dow = task.extendedProps.daysOfWeek === '' ? undefined : task.extendedProps.daysOfWeek;

        return {
            ...task,
            daysOfWeek: dow,

            startTime: dow != null && !task.allDay ?
                DateTime.fromISO(task.start).toFormat('HH:mm:ss') : undefined,

            endTime: dow != null && !task.allDay && task.end != null ?
                DateTime.fromISO(task.end).toFormat('HH:mm:ss') : undefined,
        };
    });
};

export function serializeTasks(tasks: EventApi[]) {
    const formatted = tasks.map((task) => {
        const formattedTask = {
            title: task.title,
            start: task.start,
            end: task.end,
            allDay: task.allDay,
            extendedProps: task.extendedProps,
            classNames: task.classNames,
            groupId: task.groupId,
        };

        return {
            ...formattedTask,
            classNames: formattedTask.classNames.filter((cls) => cls !== 'task-selected'),
            start: serializeDate(formattedTask.start),
            end: serializeDate(formattedTask.end),
        };
    });

    return JSON.stringify(formatted);
}

export function saveTasks(tasks: EventApi[]) {
    const serialized = serializeTasks(tasks);
    localStorage.setItem(lsKey, serialized);
}

export function remove<T>(array: T[], value: T) {
    array.splice(array.indexOf(value), 1);
}

export class Signal {
    public handlers: Function[];

    constructor() {
        this.handlers = [];
    }

    next() {
        this.handlers.forEach((handle) => {
            handle();
        });
    }

    subscribe(handler: Function) {
        this.handlers.push(handler);
    }
}
