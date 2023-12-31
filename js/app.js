class CalorieTracker {
    constructor() {
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
    }

    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
    }

    removeMeal() {

    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories
    }

    removeWorkout(){}

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
        div.innerHTML = `${this._totalCalories}`;
    }

    _displayCaloriesLimit() {
        const div = document.getElementById('calories-limit');
        div.innerHTML = `${this._calorieLimit}`;
    }

    _displayCaloriesConsumed() {
        const div = document.getElementById('calories-consumed');
        const calorieConsumed = this._meals.reduce((accumulator, meal) => accumulator + meal.calories)
        div.innerHTML = `${calorieConsumed}`;
    }

    _displayCaloriesBurned() {
        const div = document.getElementById('calories-burned');
        const calorieBurned = this._workouts.reduce((accumulator, workout) => accumulator + workout.calories)
        div.innerHTML = `${calorieBurned}`;
    }

    _displayCaloriesRemaining() {
        const div = document.getElementById('calories-remaining');
        div.innerHTML = `${this._calorieLimit - this._totalCalories}`;
    }

    _displayNewMeal() {

    }

    _displayNewWorkout() {

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

const breakfast = new Meal('Breakfast', 400);
const dips = new Workout('dips', 150);

tracker.addMeal(breakfast);
tracker.addWorkout(dips);

console.log(tracker)