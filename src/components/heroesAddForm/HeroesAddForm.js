import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { useHttp } from "../../hooks/http.hook";
import { heroCreated } from "../heroesList/heroesSlice";

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState("");
    const [heroDescription, setHeroDescription] = useState("");
    const [heroElement, setHeroElement] = useState("");

    const { filters, filtersLoadingStatus } = useSelector((state) => state.filters);
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
                .then((data) => console.log(data, "Успешно создан в базе данных"))
                .then(() => dispatch(heroCreated(newHero)))
                .catch((error) => console.log(error));
        } else {
            alert("Для добавления героя необходимо заполнить все поля");
        }

        //cleansing the form
        setHeroName("");
        setHeroDescription("");
        setHeroElement("");
    };

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>;
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>;
        }

        if (filters && filters.length > 0) {
            return filters.map(({ name, label }) => {
                //unnecessary filter
                // eslint-disable-next-line
                if (name === "all") return;

                return (
                    <option key={name} value={name}>
                        {label}
                    </option>
                );
            });
        }
    };

    const elements = renderFilters(filters, filtersLoadingStatus);

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
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
                    value={heroName}
                    onChange={(event) => setHeroName(event.target.value)}
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
                    value={heroDescription}
                    onChange={(event) => setHeroDescription(event.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">
                    Выбрать элемент героя
                </label>
                <select
                    required
                    className="form-select"
                    id="element"
                    name="element"
                    value={heroElement}
                    onChange={(event) => setHeroElement(event.target.value)}
                >
                    <option value="">Я владею элементом...</option>
                    {elements}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">
                Создать
            </button>
        </form>
    );
};

export default HeroesAddForm;
