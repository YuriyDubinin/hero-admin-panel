import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useHttp } from "../../hooks/http.hook";

import { heroAdded, filterHeroes } from "../../actions";

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState("");
    const [heroDescription, setHeroDescription] = useState("");
    const [heroElement, setHeroElement] = useState("");

    const { filters } = useSelector((state) => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    const onSubmitHandler = (event) => {
        event.preventDefault();

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescription,
            element: heroElement,
        };

        if ((newHero.name && newHero.description && newHero.element) || newHero.element === "all") {
            request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
                .then(() => dispatch(heroAdded(newHero)))
                .then(() => dispatch(filterHeroes()))
                .then(() => console.log(newHero, "Успешно создан в базе данных"))
                .catch((error) => console.log(error));
        } else {
            alert("Для добавления героя необходимо заполнить все поля");
        }

        //clear form
        setHeroName("");
        setHeroDescription("");
        setHeroElement("");
    };

    const renderFiltersList = (arr) => {
        const items = arr.map((item, i) => {
            let label;

            switch (item) {
                case "all":
                    label = "Я владею элементом...";
                    break;
                case "fire":
                    label = "Огонь";
                    break;
                case "water":
                    label = "Вода";
                    break;
                case "wind":
                    label = "Воздух";
                    break;
                case "earth":
                    label = "Земля";
                    break;
                default:
                    break;
            }

            return (
                <option key={i} value={item}>
                    {label}
                </option>
            );
        });

        return (
            <select
                required
                className="form-select"
                id="element"
                name="element"
                onChange={(event) => setHeroElement(event.target.value)}
            >
                {items}
            </select>
        );
    };

    const elements = renderFiltersList(filters);

    return (
        <form className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">
                    Имя нового героя
                </label>
                <input
                    required
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?"
                    onChange={(event) => setHeroName(event.target.value)}
                    value={heroName}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">
                    Описание
                </label>
                <textarea
                    required
                    name="text"
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    style={{ height: "130px" }}
                    onChange={(event) => setHeroDescription(event.target.value)}
                    value={heroDescription}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">
                    Выбрать элемент героя
                </label>
            </div>

            {elements}

            <button onClick={onSubmitHandler} className="btn btn-primary" style={{ marginTop: "10px" }}>
                Создать
            </button>
        </form>
    );
};

export default HeroesAddForm;
