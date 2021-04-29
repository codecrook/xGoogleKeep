{
    'use strict';

    class App {
        constructor() {
            this.notes = JSON.parse(localStorage.getItem('notes')) || [];
            this.id = '';
            this.title = '';
            this.text = '';

            this.$noteTitle = document.querySelector('#note-title');
            this.$noteText = document.querySelector('#note-text');
            this.$form = document.querySelector('#form');
            this.$formButtons = document.querySelector('#form-buttons');
            this.$formCloseButton = document.querySelector('#form-close-button');

            this.$modal = document.querySelector(".modal");
            this.$modalTitle = document.querySelector(".modal-title");
            this.$modalText = document.querySelector(".modal-text");
            this.$modalCloseButton = document.querySelector('.modal-close-button');

            this.$colorTooltip = document.querySelector('#color-tooltip');

            this.$placeholder = document.querySelector('#placeholder');
            this.$notes = document.querySelector('#notes');

            this.$installButton = document.querySelector('#install-button');

            this.init();
        }

        init() {
            this.render();
            this.addEventListeners();
            this.registerServiceWorker();
        }

        addEventListeners() {
            document.body.addEventListener('click', event => {
                this.handleFormClick(event);
                this.selectNote(event);
                this.openModal(event);
                this.deleteNote(event);
            });

            document.body.addEventListener('mouseover', event => {
                this.openTooltip(event);
            });

            document.body.addEventListener('mouseout', event => {
                this.closeTooltip(event);
            });

            this.$colorTooltip.addEventListener('mouseover', function () {
                this.style.display = 'flex';
            })

            this.$colorTooltip.addEventListener('mouseout', function () {
                this.style.display = 'none';
            });

            this.$colorTooltip.addEventListener('click', event => {
                const { color } = event.target.dataset;
                (color) && this.editNoteColor(color);
            });

            this.$form.addEventListener('submit', event => {
                event.preventDefault();

                const title = this.$noteTitle.value;
                const text = this.$noteText.value;
                (title || text) && this.addNote({ title, text });
            });

            this.$formCloseButton.addEventListener('click', event => {
                event.stopPropagation();
                this.closeForm();
            });

            this.$modalCloseButton.addEventListener('click', _ => {
                this.closeModal();
            });
        }

        handleFormClick(event) {
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            const hasNote = title || text;
            const isFormClicked = this.$form.contains(event.target);

            if (isFormClicked) this.openForm();
            else if (hasNote) this.addNote({ title, text });
            else this.closeForm();
        }

        openForm() {
            this.$form.classList.add('form-open');
            this.$noteTitle.style.display = 'block';
            this.$formButtons.style.display = 'block';
        }

        closeForm() {
            this.$form.classList.remove('form-open');
            this.$noteTitle.style.display = 'none';
            this.$formButtons.style.display = 'none';

            this.$noteTitle.value = '';
            this.$noteText.value = '';
        }

        openModal(event) {
            if (event.target.matches('.toolbar-delete')) return;
            if (event.target.matches('.toolbar-color')) return;

            if (event.target.closest('.note')) {
                this.$modal.classList.toggle('open-modal');
                this.$modalTitle.value = this.title;
                this.$modalText.value = this.text;
            }
        }

        closeModal() {
            this.editNote();
            this.$modal.classList.toggle('open-modal');
        }

        openTooltip(event) {
            if (!event.target.matches('.toolbar-color')) return;
            this.id = event.target.parentNode.dataset.id;
            const noteCoords = event.target.getBoundingClientRect();
            const horizontal = noteCoords.left;
            const vertical = window.scrollY - 21;
            this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
            this.$colorTooltip.style.display = 'flex';
        }

        closeTooltip(event) {
            if (!event.target.matches('.toolbar-color')) return;
            this.$colorTooltip.style.display = 'none';
        }

        addNote({ title, text }) {
            const newNote = {
                title,
                text,
                color: 'white',
                id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
            };

            this.notes = [...this.notes, newNote];
            this.render();
            this.closeForm();
        }

        selectNote(event) {
            const $selectedNote = event.target.closest('.note');
            if (!$selectedNote) return;

            const { id, title, text } = $selectedNote.dataset;
            this.id = id;
            this.title = title;
            this.text = text;
        }

        editNote() {
            const title = this.$modalTitle.value;
            const text = this.$modalText.value;

            this.notes = this.notes.map(note => note.id === Number(this.id) ? { ...note, title, text } : note);
            this.render();
        }

        editNoteColor(color) {
            this.notes = this.notes.map(note =>
                note.id === Number(this.id) ? { ...note, color } : note
            );
            this.render();
        }

        deleteNote(event) {
            event.stopPropagation();
            if (!event.target.matches('.toolbar-delete')) return;
            const { id } = event.target.parentNode.dataset;

            this.notes = this.notes.filter(note => note.id !== Number(id));
            this.render();
        }

        displayNotes() {
            const hasNotes = this.notes.length > 0;
            this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

            this.$notes.innerHTML = this.notes.map(note => `
                <div style="background: ${note.color};" class="note"
                    data-id="${note.id}"
                    data-title="${note.title}"
                    data-text="${note.text}"
                >
                    <div class="${note.title && 'note-title'}">${note.title}</div>
                    <div class="note-text">${note.text}</div>
                    <div class="toolbar-container">
                        <div class="toolbar" data-id="${note.id}">
                            <img class="toolbar-delete" src="./img/delete.svg">
                            <img class="toolbar-edit" src="./img/edit.svg">
                            <img class="toolbar-color" src="./img/palette.svg">
                        </div>
                    </div>
                </div>
            `).join("");
        }

        saveNotes() {
            localStorage.setItem('notes', JSON.stringify(this.notes))
        }

        render() {
            this.saveNotes();
            this.displayNotes();
        }

        registerServiceWorker() {
            ("serviceWorker" in navigator) && window.addEventListener("load", function () {
                navigator.serviceWorker
                    .register("./serviceWorker.js")
                    .then(res => console.log("service worker registered"))
                    .catch(err => console.log("service worker not registered", err))
            });
        }

    }

    new App();
}