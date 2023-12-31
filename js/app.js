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
        const bsCollapse = new bootstrap.Collapse(collapse, {
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
        const bsCollapse = new bootstrap.Collapse(collapse, {
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
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }
}

class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories();
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }

    addMeal(meal) {
        this._meals.push(meal);
        Storage.setMeals(meal);
        this._totalCalories += meal.calories;
        Storage.setTotalCalories(this._totalCalories);
        this._render();
        this._displayNewMeal(meal);
    }

    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);

        if (index != -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories;
            Storage.setTotalCalories(this._totalCalories);
            this._meals.splice(index, 1);
            Storage.removeMeal(id);
            this._render();
        }
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        Storage.setWorkouts(workout)
        this._totalCalories -= workout.calories
        Storage.setTotalCalories(this._totalCalories);
        this._render();
        this._displayNewWorkout(workout)
    }

    removeWorkout(id){
        const index = this._workouts.findIndex((workout) => workout.id === id);

        if (index != -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories;
            Storage.setTotalCalories(this._totalCalories);
            this._workouts.splice(index, 1);
            Storage.removeWorkout(id);
            this._render();
        }
    }

    _displayCaloriesProgress() {
        const progressBar =document.getElementById('calorie-progress');
        const progress = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(progress, 100);
        const remaining = document.getElementById('calories-remaining').parentElement.parentElement;

        if (this._calorieLimit <= this._totalCalories) {
           progressBar.classList.add('bg-danger');
           remaining.classList.remove('bg-light'),
           remaining.classList.add('bg-danger');
        } else {
            progressBar.classList.remove('bg-danger');
            remaining.classList.remove('bg-danger');
            remaining.classList.add('bg-light');
        }
        progressBar.setAttribute('style', `width: ${width}%`);
    }

    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
    resetDay() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = []
        Storage.clearAll();
        this._render();
    }

    setLimit(limit) {
        Storage.setCalorieLimit(limit)
        this._calorieLimit = limit;
        this._displayCaloriesLimit();
        this._render();
    }

    loadItems() {
        this._meals.forEach((meal) => this._displayNewMeal(meal));
        this._workouts.forEach((workout) => this._displayNewWorkout(workout));
    }

    _displayCaloriesTotal() {
        const div = document.getElementById('calories-total');
        div.innerHTML = this._totalCalories;
    }

    _displayCaloriesLimit() {
        const div = document.getElementById('calories-limit');
        div.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const div = document.getElementById('calories-consumed');
        const calorieConsumed = this._meals.reduce((accumulator, meal) => accumulator + meal.calories, 0)
        div.innerHTML = calorieConsumed;
    }

    _displayCaloriesBurned() {
        const div = document.getElementById('calories-burned');
        const calorieBurned = this._workouts.reduce((accumulator, workout) => accumulator + workout.calories, 0)
        div.innerHTML = calorieBurned;
    }

    _displayCaloriesRemaining() {
        const div = document.getElementById('calories-remaining');
        div.innerHTML = `${this._calorieLimit - this._totalCalories}`;
    }

    _displayNewMeal(meal) {
        const mealItems = document.getElementById('meal-items');
        const div = document.createElement('div');

        div.classList.add('card', 'my-2');
        div.setAttribute('data-id', meal.id);
        div.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div
            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>`;

        mealItems.appendChild(div);
    }

    _displayNewWorkout(workout) {
        const workoutItems = document.getElementById('workout-items');
        const div = document.createElement('div');

        div.classList.add('card', 'my-2');
        div.setAttribute('data-id', workout.id);
        div.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`;

      workoutItems.appendChild(div);
    }

    renderStats() {}
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Storage {
    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit;

        calorieLimit = localStorage.getItem('calorieLimit') === null
                    ? defaultLimit 
                    : +localStorage.getItem('calorieLimit');

        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories() {
        let totalCalories;

        totalCalories = localStorage.getItem('totalCalories') === null
                    ? 0
                    : +localStorage.getItem('totalCalories');

        return totalCalories;
    }

    static setTotalCalories(totalCalories) {
        localStorage.setItem('totalCalories', totalCalories);
    }

    static getMeals() {
        let meals;

        meals = localStorage.getItem('meals') === null
                    ? [] 
                    : JSON.parse(localStorage.getItem('meals'));

        return meals;
    }

    static setMeals(meal) {
        const meals = Storage.getMeals();
        meals.push(meal);

        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeMeal(id) {
        const meals = Storage.getMeals();

        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
            }
        });

        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static getWorkouts() {
        let workouts;

        workouts = localStorage.getItem('workouts') === null
                    ? [] 
                    : JSON.parse(localStorage.getItem('workouts'));

        return workouts;
    }

    static setWorkouts(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();

        workouts.forEach((workout, index) => {
            if (workout.id === id) {
                workouts.splice(index, 1);
            }
        });

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static clearAll() {
        localStorage.removeItem('totalCalories');
        localStorage.removeItem('meals');
        localStorage.removeItem('workouts');
    }
}

const init = new App();