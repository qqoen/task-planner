import RModal from 'rmodal';
import { DateTime } from 'luxon';
import toastr from 'toastr';

import { $, getTasks } from './utils';
import { initializeCalendar } from './calendar';


toastr.options.positionClass = 'toast-bottom-right';


function main() {
    const addModal = new RModal(
        $('#addModal'),
        {
            afterOpen: () => {
                $('#newTaskDate').value = DateTime.local().toISODate();
            },
        },
    );

    const tasks = getTasks();

    const calendar = initializeCalendar(addModal);

    tasks.forEach((task) => {
        calendar.addEvent(task);
    });

    $('#addBtn').addEventListener('click', (e) => {
        e.preventDefault();

        const date = $('#newTaskDate').value;
        const title = $('#newTaskTitle').value;
        const priorityClass = $('#newTaskPriority').value;
        const recurrentDays = $('#newTaskRecurrence').value;

        const tasks = calendar.getEvents();

        const duplicate = tasks.find((task) => task.title === title);

        if (duplicate != null) {
            toastr.warning('Task with this title already exist');
            return;
        }

        const opts = {
            title,
            start: date,
            allDay: true,
            classNames: [priorityClass],
            daysOfWeek: recurrentDays,
            extendedProps: {
                daysOfWeek: recurrentDays,
            },
        };

        try {
            calendar.addEvent(opts);
            toastr.success('Task was successfully added');
        } catch {
            toastr.error('Unable to add new task');
        }
    });

    $('#closeAddBtn').addEventListener('click', (e) => {
        e.preventDefault();

        addModal.close();
    });
}

document.addEventListener('DOMContentLoaded', main);
