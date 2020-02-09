/**
 * FullCalendar plugin stuff: initialization, configuration, etc.
 */

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import toastr from 'toastr';
import { DateTime } from 'luxon';

import { $, saveTasks, remove, serializeTasks } from './utils';


function onImport(calendar) {
    const fileInput = document.createElement('input');

    fileInput.type = 'file';

    document.body.appendChild(fileInput);
    fileInput.click();

    fileInput.addEventListener('input', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsText(file, 'UTF-8');

        reader.onload = (evt) => {
            try {
                const tasks = JSON.parse(evt.target.result) || [];
                const oldTasks = calendar.getEvents();

                // remove current tasks
                oldTasks.forEach((task) => {
                    task.remove();
                });

                // add imported tasks
                tasks.forEach((task) => {
                    calendar.addEvent(task);
                })

                toastr.success('Imported successfully');
            } catch {
                toastr.error('Unable to import tasks');
            }
        }

        reader.onerror = (evt) => {
            toastr.error('Error reading file');
        }

        setTimeout(() => {
            document.body.removeChild(fileInput);
        }, 0);
    });
}


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
            right: 'saveBtn exportBtn importBtn prevYear,prev,next,nextYear',
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
                icon: 'calendar',
                click: () => {
                    try {
                        saveTasks(calendar.getEvents());
                        toastr.success('Tasks were saved successfully');
                    } catch {
                        toastr.error('Unable to save tasks');
                    }
                },
            },
            exportBtn: {
                text: 'export',
                click: () => {
                    const tasks = calendar.getEvents();
                    const json = serializeTasks(tasks);
                    const file = new Blob([json], {type: 'application/json' });
                    const a = document.createElement('a');
                    const url = URL.createObjectURL(file);

                    a.href = url;
                    a.download = 'export.json';

                    document.body.appendChild(a);
                    a.click();

                    setTimeout(() => {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                },
            },
            importBtn: {
                text: 'import',
                click: () => {
                    onImport(calendar);
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
