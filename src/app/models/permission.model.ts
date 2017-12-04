export interface IPermission {
    id: number;
    user_id: number;
    code: string;
    title: string;
    enabled: boolean;
};


export class Permission {
    id: number = 0;
    userId: number = 0;
    code: string = '';
    title: string = '';
    enabled: boolean = false;

    constructor(config?: IPermission) {
        if (config) {
            this.id = config.id;
            this.userId = config.user_id;
            this.code = config.code;
            this.title = config.title;
            this.enabled = config.enabled;
        }
    };
};
