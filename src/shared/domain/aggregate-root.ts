export abstract class AggregateRoot<T> {
    protected readonly props: T;
    private readonly _id: string;

    protected constructor(props: T, id?: string) {
        this.props = props;
        this._id = id ? id : Math.random().toString(36).substring(2, 9);
    }

    get id(): string {
        return this._id;
    }
}