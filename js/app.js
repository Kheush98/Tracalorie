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
    }

    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._render();
        this._displayNewMeal(meal);
    }

    removeMeal() {

    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories
        this._render();
        this._displayNewWorkout(workout)
    }

    removeWorkout(){}

    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
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

    loadItems() {}

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

const tracker = new CalorieTracker();

const breakfast = new Meal('Breakfast', 500);
const dips = new Workout('Dips', 150);
const burger = new Meal('Burgers', 450);
const run = new Workout('Run for 30 min', 200);

tracker.addMeal(breakfast);
tracker.addWorkout(dips);
tracker.addMeal(burger);
tracker.addWorkout(run);

console.log(tracker)