import { User } from "./user.model";


export interface ISession {
    token: string;
    user_id?: number;
    started: number;
    expires?: number;
};


export interface ISessionData {
    session?: Session;
    user?: User;
};


export class Session {
    token: string;
    userId: number;
    started: Date;
    expires: Date;

    constructor(config: ISession) {
        this.token = config.token !== '' ? config.token : '';
        this.started = config.started !== 0 && config.started > 0 ? new Date(config.started): new Date();
        this.expires = config.expires !== 0 && config.expires > 0 && new Date(config.expires) > this.started ? new Date(config.expires) : new Date;
        this.userId = config.user_id && config.user_id !== 0 ? config.user_id : 0;
    };
};