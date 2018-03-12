import Fund from '../models/fund';

export function getFunds(state) {
    return state.funds as Fund[];
}

export function getFund(state, fundRunnerId) {
    return isFund(state, fundRunnerId) ?
        (state.funds as Fund[]).filter(fund => fund.fundRunnerId === fundRunnerId).pop() :
        null;
}

export function isFund(state, fundRunnerId) {
    return (state.funds as Fund[]).some(fund => fund.fundRunnerId === fundRunnerId);
}