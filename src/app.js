import '@fortawesome/fontawesome-free/js/all';
import {Modal, Collapse} from 'bootstrap';
import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';

import './css/bootstrap.css';
import './css/style.css';

class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._tracker.loadItems();
        document.getElementById('meal-form').addEventListener('submit', this._newMeal.bind(this));
        document.getElementById('workout-form').addEventListener('submit', this._newWorkout.bind(this));
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));
        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));
        document.getElementById('reset').addEventListener('click', this._reset.bind(this));
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
    }

    _newMeal(event) {
        event.preventDefault();
        const name = document.getElementById('meal-name');
        const calories = document.getElementById('meal-calories');
        const meal = new Meal(name.value, +calories.value);

        if (name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
            return;
        }

        this._tracker.addMeal(meal);
        name.value = '';
        calories.value = '';

        const collapse = document.getElementById('collapse-meal');
        const bsCollapse = new Collapse(collapse, {
            toggle: true,
        });
    }

    _newWorkout(event) {
        event.preventDefault();
        const name = document.getElementById('workout-name');
        const calories = document.getElementById('workout-calories');
        const workout = new Workout(name.value, +calories.value);

        if (name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
            return;
        }

        this._tracker.addWorkout(workout);
        name.value = '';
        calories.value = '';

        const collapse = document.getElementById('collapse-workout');
        const bsCollapse = new Collapse(collapse, {
            toggle: true,
        });
    }

    _removeItem(type, event) {
        if (event.target.classList.contains('delete') || event.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure ?')) {
                const id = event.target.closest('.card').getAttribute('data-id');

                type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);

                event.target.closest('.card').remove();
            }
        }
    }

    _filterItems(type, event) {
        const text = event.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
            const name = item.firstElementChild.firstElementChild.textContent;

            if (name.toLowerCase().includes(text)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        })
    }

    _reset() {
        this._tracker.resetDay();
        document.querySelectorAll('#meal-items .card, #workout-items .card').forEach((item) => item.remove());
    }

    _setLimit(event) {
        event.preventDefault();
        let limit = document.getElementById('limit');

        if (!isNaN(+limit.value) && +limit.value != 0) {
            this._tracker.setLimit(+limit.value);
            limit.value = '';
        } else {
            alert('Set a number please !');
        }

        const modalEl = document.getElementById('limit-modal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
    }
}


const init = new App();