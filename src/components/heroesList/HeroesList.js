import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { useHttp } from "../../hooks/http.hook";
import { heroesFetching, heroesFetched, heroesFetchingError, heroDeleted, filterHeroes } from "../../actions";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

import "./heroesList.scss";

const HeroesList = () => {
    const { heroesLoadingStatus, filteredHeroes } = useSelector((state) => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then((data) => dispatch(heroesFetched(data)))
            .then(() => dispatch(filterHeroes()))
            .catch(() => dispatch(heroesFetchingError()));

        // eslint-disable-next-line
    }, []);

    const onDeleted = (id) => {
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(() => dispatch(heroDeleted(id)))
            .then(() => dispatch(filterHeroes()))
            .then(() => console.log(`Герой с id: ${id} успешно удалён из базы данных`))
            .catch((error) => console.log(error));
    };

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition classNames="hero-list-item" timeout={500}>
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            );
        }

        return arr.map(({ id, ...props }) => {
            return (
                <CSSTransition classNames="hero-list-item" key={id} timeout={500}>
                    <HeroesListItem {...props} onDeleted={() => onDeleted(id)} />
                </CSSTransition>
            );
        });
    };

    const elements = renderHeroesList(filteredHeroes);
    return <TransitionGroup component="ul">{elements}</TransitionGroup>;
};

export default HeroesList;
