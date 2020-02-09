/**
 * FullCalendar plugin stuff: initialization, configuration, etc.
 */

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import toastr from 'toastr';

import { $, saveTasks, remove } from './utils';


export function initializeCalendar(addModal) {
    const calendarEl = $('#calendar');
    const selectedTasks = [];

    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        defaultView: 'timeGridDay',
        height: 'parent',
        editable: true,
        scrollTime: '00:00:00',
        header: {
            left: 'timeGridDay,timeGridWeek,dayGridMonth addBtn deleteBtn editBtn',
            center: 'title',
            right: 'saveBtn prevYear,prev,next,nextYear',
        },
        customButtons: {
            addBtn: {
                text: 'new',
                click: () => {
                    addModal.open();
                },
            },
            deleteBtn: {
                text: 'delete',
                click: () => {
                    calendar.getEvents().forEach((event) => {
                        if (selectedTasks.includes(event.title)) {
                            event.remove();
                        }
                    });
                },
            },
            editBtn: {
                text: 'edit',
                click: () => {
                },
            },
            saveBtn: {
                text: 'save',
                click: () => {
                    try {
                        saveTasks(calendar.getEvents());
                        toastr.success('Tasks were saved successfully');
                    } catch {
                        toastr.error('Unable to save tasks');
                    }
                },
            },
        },
        eventClick: (data) => {
            const classes = data.event.classNames;
            const selectedCls = 'task-selected';

            if (classes.includes(selectedCls)) {
                data.event.setProp('classNames', classes.filter((cls) => cls !== selectedCls))
                remove(selectedTasks, data.event.title);
            } else {
                data.event.setProp('classNames', classes.concat([selectedCls]));
                selectedTasks.push(data.event.title);
            }
        },
    });

    calendar.render();

    return calendar;
}
