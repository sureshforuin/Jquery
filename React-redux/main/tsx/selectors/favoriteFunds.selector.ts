import Fund from '../models/fund';

export function isFavoriteFund(state, fund: Fund) {
    return (state.favoriteFunds as Fund[]).some(favoriteFund => favoriteFund.fundId === fund.fundId);
}

export function getFavoriteFunds(state) {
    return state.favoriteFunds as Fund[];
}