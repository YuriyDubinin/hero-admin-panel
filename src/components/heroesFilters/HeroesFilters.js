import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";

import { filtersFetching, filtersFetched, filtersFetchingError, setActiveFilter, filterHeroes } from "../../actions";
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
    const { filters, filtersLoadingStatus, activeFilter } = useSelector((state) => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then((data) => {
                dispatch(filtersFetched(data));
            })
            .catch(() => dispatch(filtersFetchingError()));

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return (
            <div style={{ display: "flex" }}>
                return <h5 className="text-center mt-5">Загрузка фильтров</h5>;
                <Spinner />
            </div>
        );
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
    }

    const renderFiltersList = (arr) => {
        const items = arr.map((item, i) => {
            let classNames = "btn ";
            let label;

            switch (item) {
                case "all":
                    classNames += "btn-outline-dark";
                    label = "Все";
                    break;
                case "fire":
                    classNames += "btn-danger";
                    label = "Огонь";
                    break;
                case "water":
                    classNames += "btn-primary";
                    label = "Вода";
                    break;
                case "wind":
                    classNames += "btn-success";
                    label = "Воздух";
                    break;
                case "earth":
                    classNames += "btn-secondary";
                    label = "Земля";
                    break;
                default:
                    break;
            }

            if (item === activeFilter) {
                classNames += " active";
            }

            return (
                <button
                    key={i}
                    className={classNames}
                    onClick={() => {
                        dispatch(setActiveFilter(item));
                        dispatch(filterHeroes());
                    }}
                >
                    {label}
                </button>
            );
        });

        return <div className="btn-group">{items}</div>;
    };

    const elements = renderFiltersList(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                {elements}
            </div>
        </div>
    );
};

export default HeroesFilters;
