import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { createSelector } from "@reduxjs/toolkit";

import { useHttp } from "../../hooks/http.hook";
import { heroDeleted, fetchHeroes } from "./heroesSlice";

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

import "./heroesList.scss";

const HeroesList = () => {
    const filteredHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        (state) => state.heroes.heroes,
        (filter, heroes) => {
            if (filter === "all") {
                return heroes;
            } else {
                return heroes.filter((item) => item.element === filter);
            }
        }
    );

    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector((state) => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());

        // eslint-disable-next-line
    }, []);

    const onDeleted = useCallback(
        (id) => {
            request(`http://localhost:3001/heroes/${id}`, "DELETE")
                .then(() => console.log(`Герой с id: ${id} успешно удалён из базы данных`))
                .then(() => dispatch(heroDeleted(id)))
                .catch((error) => console.log(error));
        },
        // eslint-disable-next-line
        [request]
    );

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
