import Benchmark from '../models/benchmark';

export function getBenchmarks(state) {
    return state.benchmarks as Benchmark[];
}