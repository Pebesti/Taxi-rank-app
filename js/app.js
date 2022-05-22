import routes from "./rank-data.js";
import Alpine from "alpinejs";

window.Alpine = Alpine;

Alpine.data("taxiRank", routes);

Alpine.start();
