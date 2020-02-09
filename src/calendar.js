/**
 * FullCalendar plugin stuff: initialization, configuration, etc.
 */

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { $ } from './utils';


export function initializeCalendar(addModal) {
    const calendarEl = $('#calendar');
    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        defaultView: 'timeGridDay',
        height: 'parent',
        editable: true,
        header: {
            left: 'timeGridDay,timeGridWeek,dayGridMonth addBtn deleteBtn editBtn',
            center: 'title',
            right: 'prevYear,prev,next,nextYear',
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
                },
            },
            editBtn: {
                text: 'edit',
                click: () => {
                },
            },
        },
    });

    calendar.render();

    return calendar;
}
