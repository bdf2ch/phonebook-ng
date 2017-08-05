export interface ICookie {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    expires?: Date;
    secure?: boolean;
};


export class Cookie {
    name: string;
    value: string;
    path: string = '';
    domain: string = '';
    expires: Date = new Date('01 Jan 1970 00:00');
    secure: boolean = false;


    constructor (config: ICookie | string) {
        if (typeof config === "string") {
            config.split(';').forEach((value: string, index: number, array: string[]) => {
                let param = value.trim().split('=');
                console.log('param = ', param);
                switch (param[0]) {
                    case 'path': this.path = param[1] !== '' ? param[1] : '/'; break;
                    case 'domain': this.domain = param[1]; break;
                    case 'expires': this.expires = new Date(param[1]); break;
                    case 'secure': this.secure = param[1] === 'true' ? true : false; break;
                    default: this.name = param[0]; this.value = decodeURIComponent(param[1]); break;
                };
            });
        } else {
            this.name = config.name;
            this.value = config.value;
            this.path = config.path ? config.path : '';
            this.domain = config.domain ? config.domain : '';
            this.expires = config.expires ? config.expires : new Date('01 Jan 1970 00:00');
            this.secure = config.secure ? config.secure : false;
        }
    };


    save(): string {
        let cookie = this.name + '=' + encodeURIComponent(this.value);
        cookie += this.path !== '' && this.path !== '/' ? '; path=' + this.path : '';
        cookie += this.domain !== '' ? '; domain=' + this.domain : '';
        cookie += this.expires.getUTCMilliseconds() !== 0 ? '; expires=' + this.expires.toUTCString() : '';
        cookie += this.secure ? '; secure=true' : '';
        console.log('serialized cookie = ', cookie);
        return cookie;
    };


    serialize(): string {
        return `${this.name}=${encodeURIComponent(this.value)}`;
    };
};
