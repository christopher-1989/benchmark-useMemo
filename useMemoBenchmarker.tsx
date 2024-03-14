import { useMemo } from 'react'

/**
 * useMemoBenchmarker hook:
 *
 * Note, must obey the laws of React Hooks - file name must start with "use", 
 * must be used at the top level of a React component and must be used in 
 * a .jsx/.tsx file
 * 
 * @param {function} func The function to be benchmarked
 * @outputs Statement of results with time in milliseconds
 *
 * Example usage:
 *
 * 1)
 * function heavyLoad() { some complex computation logic here }
 *
 * useMemoBenchmarker(heavyLoad)
 *
 * stdout >> Function versus memoisation process {
    "fasterFunction": "function",
    "fasterBy": 3.399999976158142
}
 * stdout >> Function call versus calling memoised function {
    "fasterFunction": "memo",
    "fasterBy": 8.899999976158142
}

 * The console output shows function to have performed faster on the first run 
 * and memo to have performed faster on the subsequent call by more than 2 times
 *
 * 2)
 * const dataList = [ some data here ]
 *
 * useMemoBenchmarker(() => dataList.sort())
 *
 *  ***Same two output as example 1***
 */

type FasterFunction = 'function' | 'memo' | 'no diff'

type BenchmarkResult = {
    fasterFunction: FasterFunction
    fasterBy: number
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const useMemoBenchmarker = (func: Function): void => {
    const functionToTest = func

    const beforeFuncTime = performance.now()
    functionToTest()
    const afterFuncTime = performance.now() - beforeFuncTime

    const beforeMemoTime = performance.now()
    const memoizedFunctionCall = useMemo(
        () => functionToTest(),
        [functionToTest]
    )
    const afterMemoTime = performance.now() - beforeMemoTime

    console.log(
        'Function versus memoisation process',
        getResultFromExperiment({
            memoTime: afterMemoTime,
            functionTime: afterFuncTime,
        })
    )

    const beforeMemo2Time = performance.now()
    memoizedFunctionCall
    const afterMemo2Time = performance.now() - beforeMemo2Time

    console.log(
        'Function call versus calling memoised function',
        getResultFromExperiment({
            memoTime: afterMemo2Time,
            functionTime: afterFuncTime,
        })
    )
}

function getResultFromExperiment({
    memoTime,
    functionTime,
}: {
    memoTime: number
    functionTime: number
}): BenchmarkResult {
    let fasterFunction: FasterFunction
    if (functionTime > memoTime) {
        fasterFunction = 'memo'
    } else if (memoTime > functionTime) {
        fasterFunction = 'function'
    } else {
        fasterFunction = 'no diff'
    }

    return {
        fasterFunction,
        fasterBy: Math.abs(memoTime - functionTime),
    }
}
