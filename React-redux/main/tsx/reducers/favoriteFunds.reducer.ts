import Action from '../models/action';
import Fund from '../models/fund';

const ADD_FUND_TO_FAVORITES = 'ADD_FUND_TO_FAVORITES';
const CLEAR_FAVORITES = 'CLEAR_FAVORITES';
const REMOVE_FUND_FROM_FAVORITES = 'REMOVE_FUND_FROM_FAVORITES';

export function addFundToFavorites(fund: Fund) {
    return {
        type: ADD_FUND_TO_FAVORITES,
        payload: fund
    };
}

export function clearFavorites() {
    return {
        type: CLEAR_FAVORITES
    };
}

export function favoriteFund(state: Fund = null, action: Action) {
    switch (action.type) {
        case ADD_FUND_TO_FAVORITES:
            return (action.payload as Fund);

        default:
            return state;
    }
}

export default function favoriteFunds(state: Fund[] = [], action: Action) {
    switch (action.type) {
        case ADD_FUND_TO_FAVORITES:
            const fundToAdd = favoriteFund(null, action);
            if (fundToAdd) {
                // if fund is already present in the list, then don't add it again
                const fundAlreadyInState = state.some(fundInState => fundInState.fundId === fundToAdd.fundId);
                return fundAlreadyInState ? state : [...state, fundToAdd];
            }

            return state;

        case CLEAR_FAVORITES:
            return [];

        case REMOVE_FUND_FROM_FAVORITES:
            return state.filter(fund => fund.fundId !== (action.payload as Fund).fundId);

        default:
            return state;
    }
}

export function removeFundFromFavorites(fund: Fund) {
    return {
        type: REMOVE_FUND_FROM_FAVORITES,
        payload: fund
    };
}