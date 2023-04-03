export const nextIndex = (current: number, arrSize: number) => {
    return current+1 === arrSize ? 0 : current+1
}

export const prevIndex = (current: number, arrSize: number) => {
    return current === 0 ? arrSize-1 : current-1
}
