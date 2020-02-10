import RModal from 'rmodal';
import { DateTime } from 'luxon';
import toastr from 'toastr';

import { $, getTasks } from './utils';
import { initializeCalendar, selectedTasks } from './calendar';

import '../assets/main.styl';


toastr.options.positionClass = 'toast-bottom-right';

function main() {
    const { calendar, $add, $edit } = initializeCalendar();

    getTasks().forEach((task) => {
        calendar.addEvent(task);
    });

    function renderTotalAmount() {
        const span = $('#totalAmount');
        span.innerText = calendar.getEvents().length;
    }
    renderTotalAmount();

    function clearModal() {
        $('#newTaskTitle').value = '';
        $('#newTaskPriority').value = 'priority-normal';
        $('#newTaskRecurrence').value = '';
    }

    const addModal = new RModal(
        $('#addModal'),
        {
            closeTimeout: 0,
            focus: false,
            afterOpen: () => {
                $('.modal-header').innerText = 'Create New Task';

                $('#newTaskDate').value = DateTime.local().toISODate();
            },
            afterClose: () => {
                clearModal();
            },
        },
    );

    const editModal = new RModal(
        $('#addModal'),
        {
            closeTimeout: 0,
            focus: false,
            afterOpen: () => {
                $('.modal-header').innerText = 'Edit Task';

                const tasks = calendar.getEvents();
                const firstTitle = selectedTasks[0];
                const firstTask = tasks.find((task) => task.title === firstTitle);

                $('#newTaskDate').value = DateTime.fromJSDate(firstTask.start).toISODate();
                $('#newTaskTitle').value = firstTask.title;

                const priorityCls = firstTask.classNames.find((cls) => cls.includes('priority'));

                if (priorityCls != null) {
                    $('#newTaskPriority').value = priorityCls;
                }

                $('#newTaskRecurrence').value = firstTask.extendedProps.daysOfWeek;
            },
            afterClose: () => {
                clearModal();
            },
        },
    );

    $add.subscribe(() => {
        addModal.open();
    });

    $edit.subscribe(() => {
        if (selectedTasks.length === 0) {
            toastr.info('No tasks selected');
            return;
        }

        editModal.open();
    });

    $('#addBtn').addEventListener('click', (e) => {
        e.preventDefault();

        const date = $('#newTaskDate').value;
        const title = $('#newTaskTitle').value;
        const priorityClass = $('#newTaskPriority').value;
        const daysOfWeek = $('#newTaskRecurrence').value;

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
            daysOfWeek: daysOfWeek === '' ? undefined : daysOfWeek,
            groupId: daysOfWeek === '' ? '' : title,
            extendedProps: {
                daysOfWeek,
            },
        };

        console.log('opts', opts);

        try {
            calendar.addEvent(opts);
            renderTotalAmount();
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
