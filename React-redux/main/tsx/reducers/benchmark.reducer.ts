import Action from '../models/action';
import Benchmark from '../models/benchmark';
import { getFunds } from '../selectors/funds.selector';

const ADD_BENCHMARK = 'ADD_BENCHMARK';
const CLEAR_BENCHMARK = 'CLEAR_BENCHMARK';

export function addBencmark(benchmark: Benchmark) {
    return {
        type: ADD_BENCHMARK,
        payload: benchmark
    };
}

export function clearBenchmark() {
    return {
        type: CLEAR_BENCHMARK,
        payload: benchmark
    };
}

export function benchmark(state: Benchmark = null, action: Action) {
    switch (action.type) {
        case ADD_BENCHMARK:
            return (action.payload as Benchmark);

        default:
            return state;
    }
}

export default function benchmarks(state: Benchmark[] = [], action: Action) {
    switch (action.type) {
        case ADD_BENCHMARK:
            const benchmarkToAdd = benchmark(null, action);
            if (benchmarkToAdd) {
                // if fund is already present in the list, then don't add it again
                const fundAlreadyInState = state.some(benchmarkInState => benchmarkInState.benchmarkId === benchmarkToAdd.benchmarkId);
                return fundAlreadyInState ? state : [...state, benchmarkToAdd];
            }

            return state;

        case CLEAR_BENCHMARK:
            return [];

        default:
            return state;
    }
}