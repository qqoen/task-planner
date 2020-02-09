import RModal from 'rmodal';
import { DateTime } from 'luxon';

import { $ } from './utils';
import { initializeCalendar } from './calendar';


function main() {
    const addModal = new RModal(
        $('#addModal'),
        {
            afterOpen: () => {
                $('#newTaskDate').value = DateTime.local().toISODate();
            },
        },
    );

    const calendar = initializeCalendar(addModal);

    $('#addBtn').addEventListener('click', (e) => {
        e.preventDefault();

        const date = $('#newTaskDate').value;
        const title = $('#newTaskTitle').value;

        calendar.addEvent({
            title,
            start: date,
            allDay: true,
        });

        addModal.close();
    });

    $('#closeAddBtn').addEventListener('click', (e) => {
        e.preventDefault();

        addModal.close();
    });
}

document.addEventListener('DOMContentLoaded', main);
