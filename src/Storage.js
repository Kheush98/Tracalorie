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

export default Storage;