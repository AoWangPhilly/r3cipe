import ingredients from "./ingredients.json" assert { type: "json" };
import axios from "axios";

ingredients.forEach((ingredient) => {
    axios
        .post("http://localhost:3000/api/ingredients", ingredient)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
});
