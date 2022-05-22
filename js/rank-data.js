export default () => ({
  routes: [
    {
      destination: "Belhar",
      passengers: 0,
      taxis: 0,
      departed: 0,
      fare: 22.5,
    },
    {
      destination: "Bellville",
      passengers: 0,
      taxis: 0,
      departed: 0,
      fare: 15.5,
    },
    {
      destination: "Makhaza",
      passengers: 0,
      taxis: 0,
      departed: 0,
      fare: 18.5,
    },
  ],
  totalTaxiIncome: 0,
  newDestination: "",
  newDestinationError: "",
  newFare: 0.0,
  showDestination: false,

  getNewFare() {
    try {
      return Number(this.newFare);
    } catch (e) {}

    return 0;
  },

  addDestination() {
    let new_fare_value = this.getNewFare();
    let destination_value = this.newDestination.trim();

    if (destination_value.length < 2) {
      this.newDestinationError = "Destination must be 2 or more characters";
    } else if (new_fare_value < 1) {
      this.newDestinationError = "Fare must be a more than 0";
    } else {
      this.newDestinationError = "Destination added";
      this.newDestination = "";
      this.newFare = 0;
      this.showDestination = false;
      this.routes.push({
        destination: destination_value,
        passengers: 0,
        taxis: 0,
        departed: 0,
        fare: new_fare_value,
      });

      this.checkRoutes();
    }
  },

  init() {
    if (localStorage.getItem("routeData")) {
      this.routes = JSON.parse(localStorage.getItem("routeData"));
    }
    this.checkRoutes();
  },

  findRoute(destination) {
    return this.routes.findIndex((route) => route.destination == destination);
  },

  addPassenger(destination, noPassengers) {
    const index = this.findRoute(destination);
    this.routes[index].passengers += Number(noPassengers);
    this.checkRoutes();
  },
  removePassenger(destination, noPassengers) {
    const index = this.findRoute(destination);

    this.routes[index].passengers =
      this.routes[index].passengers - noPassengers < 0
        ? 0
        : this.routes[index].passengers - noPassengers;
    this.checkRoutes();
  },

  addTaxi(destination, taxiNo) {
    const index = this.findRoute(destination);
    this.routes[index].taxis += Number(taxiNo);
    this.checkRoutes();
  },

  updateQueue(index) {
    const maxPassenger = 11;
    const taxiPassengers = this.routes[index].taxis * maxPassenger;

    if (
      this.routes[index].passengers >= maxPassenger &&
      this.routes[index].taxis > 0
    ) {
      let remain = this.routes[index].passengers % maxPassenger;
      const neededTaxis =
        (this.routes[index].passengers - remain) / maxPassenger;

      if (this.routes[index].taxis >= neededTaxis) {
        this.routes[index].taxis -= neededTaxis;
        this.routes[index].departed += neededTaxis;
      } else {
        remain += (neededTaxis - this.routes[index].taxis) * maxPassenger;

        this.routes[index].departed += this.routes[index].taxis;
        this.routes[index].taxis = 0;
      }

      this.routes[index].passengers = remain;
    }
  },

  checkRoutes() {
    this.totalTaxiIncome = 0;
    return this.routes.map((route, index) => {
      this.updateQueue(index);
      this.saveRoutes();
      this.totalTaxiIncome += Number(route.fare * route.departed).toFixed(2);
      return {
        destination: route.destination,
        numPassengers: route.passengers,
        noPassengers: 0,
        taxiNo: 0,
        taxiQueue: route.taxis,
        fare: route.fare,
        departed: route.departed,
        income: Number(route.fare * route.departed).toFixed(2),
      };
    });
  },
  getTotalTaxiIncome() {
    return this.totalTaxiIncome;
  },

  saveRoutes() {
    localStorage.setItem("routeData", JSON.stringify(this.routes));
  },
});
