class App {
    constructor() {
        this._tracker = new CalorieTracker();
        document.getElementById('meal-form').addEventListener('submit', this._newMeal.bind(this));
        document.getElementById('workout-form').addEventListener('submit', this._newWorkout.bind(this));
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
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
}

class CalorieTracker {
    constructor() {
        this._calorieLimit = 3000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }

    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._render();
        this._displayNewMeal(meal);
    }

    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);

        if (index != -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories;
            this._meals.splice(index, 1);
            this._render();
        }
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories
        this._render();
        this._displayNewWorkout(workout)
    }

    removeWorkout(id){
        const index = this._workouts.findIndex((workout) => workout.id === id);

        if (index != -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories;
            this._workouts.splice(index, 1);
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
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = []
    }

    setLimit(limit) {
        this._calorieLimit = limit;
    }

    loadItems() {
        
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

const init = new App();