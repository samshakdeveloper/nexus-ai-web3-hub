export class Ok<T, E> {

    readonly isOk: true = true;
    readonly isErr: false = false;
    constructor(public readonly value: T) {}

    public unwrap(): T {
        return this.value;
    }
}

export class Err<T, E> {
    readonly isOk: false = false;
    readonly isErr: true = true;

    constructor(public readonly error: E) {}

    public unwrap(): T {
        throw new Error('Cannot unwrap an Err value');
    }
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export const ok = <T, E = never>(value: T): Result<T, E> => new Ok<T, E>(value);
export const err = <T = never, E = unknown>(error: E): Result<T, E> => new Err<T, E>(error);