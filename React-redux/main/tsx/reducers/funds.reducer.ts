import Action from '../models/action';
import Fund from '../models/fund';
import { getFunds } from '../selectors/funds.selector';

const ADD_FUND = 'ADD_FUND';
const CLEAR_FUNDS = 'CLEAR_FUNDS';

export function addFund(fund: Fund) {
    return {
        type: ADD_FUND,
        payload: fund
    };
}

export function clearFunds() {
    return {
        type: CLEAR_FUNDS,
        payload: funds
    };
}

export function fund(state: Fund = null, action: Action) {
    switch (action.type) {
        case ADD_FUND:
            return (action.payload as Fund);

        default:
            return state;
    }
}

export default function funds(state: Fund[] = [], action: Action) {
    switch (action.type) {
        case ADD_FUND:
            const fundToAdd = fund(null, action);
            if (fundToAdd) {
                // if fund is already present in the list, then don't add it again
                const fundAlreadyInState = state.some(fundInState => fundInState.fundId === fundToAdd.fundId);
                return fundAlreadyInState ? state : [...state, fundToAdd];
            }

            return state;

        case CLEAR_FUNDS:
            return [];

        default:
            return state;
    }
}
