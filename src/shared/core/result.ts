export type Result<T, E = Error> = Success<T, E> | Failure<T, E>;

export class Success<T, E> {
    readonly isSuccess: true = true;
    readonly isFailure: false = false;

    constructor(public readonly value: T) {}

    public unwrap(): T {
        return this.value;
    }
}

export class Failure<T, E> {
    readonly isSuccess: false = false;
    readonly isFailure: true = true;

    constructor(public readonly error: E) {}

    public unwrap(): never {
        throw new Error('Cannot unwrap a Failure result.');
    }
}

export const ok = <T, E = Error>(value: T): Result<T, E> => new Success<T, E>(value);
export const fail = <T, E = Error>(error: E): Result<T, E> => new Failure<T, E>(error);