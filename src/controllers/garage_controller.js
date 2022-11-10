import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "insertTail"]

  connect() {
    // once page is loaded => display all cars currently in API
    this.fetchCars()
  }

  // GET all cars
  fetchCars() {
    fetch("https://wagon-garage-api.herokuapp.com/vroomvroom/cars")
      .then(response => response.json())
      .then((data) => {
        // console.log(data)

        data.forEach((car) => {

          // console.log(car)

          const html = `
              <div class="car">
                <div class="car-image">
                  <img src="http://loremflickr.com/280/280/${car.brand} ${car.model}" />
                </div>
                <div class="car-info">
                  <h4>${car.brand} ${car.model}</h4>
                  <p><strong>Owner:</strong> ${car.owner}</p>
                  <p><strong>Plate:</strong> ${car.plate}</p>
                  <button data-id="${car.id}" data-action="click->garage#crushCar">Delete</button>
                </div>
              </div>
          `

          this.insertTailTarget.insertAdjacentHTML("afterbegin", html)
        })
      })
  }

  // DELETE a car
  crushCar(event) {
    const id = event.currentTarget.dataset.id
    fetch(`https://wagon-garage-api.herokuapp.com/cars/${id}`, { method: "DELETE" })
      .then(response => response.json())
      .then((data) => {
        this.clearCars()
        this.fetchCars()
      })
  }

  // POST a new car
  createCar(event) {
    event.preventDefault();

    const buildBody = {}

    // get all the input values
    this.inputTargets.forEach((input) => {
      buildBody[input.name] = input.value
    })

    // POST to API
    fetch("https://wagon-garage-api.herokuapp.com/vroomvroom/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildBody)
    })
      .then(response => response.json())
      .then((data) => {
        // console.log(data)
        this.clearCars()
        this.fetchCars()
      })
  }

  // Clear cars container every time we make a change to API (post + delete)
  clearCars() {
    this.insertTailTarget.innerHTML = ''
  }
}
