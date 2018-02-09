export enum ErrorTypes {
    ENoErrorSpecified = 1,
    ENoSuchUser
};


export interface IRuntimeError {
    code: number;
    description: string;
};


export class RuntimeError {
    code: ErrorTypes = ErrorTypes.ENoErrorSpecified;
    description: string = '';

    constructor (config: IRuntimeError) {
        if (config) {
            this.code = config.code;
            this.description = config.description;
        }
    };
};


export function isError(obj: any): obj is IRuntimeError {
    return obj.code !== undefined && obj.description !== undefined;
}
