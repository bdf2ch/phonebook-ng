export enum ErrorTypes {
    ENoErrorSpecified = 1,
    ENoSuchUser
};


export interface IRuntimeError {
    code: ErrorTypes;
    message: string;
};


export class RuntimeError {
    code: ErrorTypes = ErrorTypes.ENoErrorSpecified;
    message: string = '';

    constructor (config: IRuntimeError) {
        if (config) {
            this.code = config.code;
            this.message = config.message;
        }
    };
};


export function isError(obj: any): obj is IRuntimeError {
    return obj.code !== undefined && obj.message !== undefined;
}
