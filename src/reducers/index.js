const initialState = {
    heroes: [],
    heroesLoadingStatus: "idle",
    filters: [],
    filtersLoadingStatus: "idle",
    activeFilter: "all",
    filteredHeroes: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "HEROES_FETCHING":
            return {
                ...state,
                heroesLoadingStatus: "loading",
            };
        case "HEROES_FETCHED":
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: "idle",

                //experimental version of initial installation of filtered heroes
                filteredHeroes: action.payload,
            };
        case "HEROES_FETCHING_ERROR":
            return {
                ...state,
                heroesLoadingStatus: "error",
            };
        case "HERO_DELETED":
            const updatedHeroList = state.heroes.filter((item) => item.id !== action.payload);
            return {
                ...state,
                heroes: updatedHeroList,
            };
        case "HERO_ADDED": {
            return {
                ...state,
                heroes: [...state.heroes, action.payload],
            };
        }
        case "FILTERS_FETCHING":
            return {
                ...state,
                filtersLoadingStatus: "loading",
            };
        case "FILTERS_FETCHED":
            return {
                ...state,
                filters: action.payload,
                filtersLoadingStatus: "idle",
            };
        case "FILTERS_FETCHING_ERROR":
            return {
                ...state,
                filtersLoadingStatus: "error",
            };
        case "SET_ACTIVE_FILTER":
            return {
                ...state,
                activeFilter: action.payload,
            };
        case "FILTER_HEROES":
            // eslint-disable-next-line
            const filteredHeroList = state.heroes.filter((item) => {
                if (state.activeFilter === "all") {
                    return item;
                }
                if (state.activeFilter === item.element) {
                    return item;
                }
            });
            return {
                ...state,
                filteredHeroes: filteredHeroList,
            };
        default:
            return state;
    }
};

export default reducer;
