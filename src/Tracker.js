import Storage from './Storage';

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

export default CalorieTracker;