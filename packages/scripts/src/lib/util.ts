export function cap(min: number, max: number, index: number) {
    return index < min ? max : index > max ? min : index;
}