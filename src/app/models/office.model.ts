export interface IOffice {
    id: number;
    organization_id: number;
    address: string;
}


export class Office {
    id: number;
    organizationId: number;
    address: string | null;

    constructor(config?: IOffice) {
        this.id = config ? config.id : 0;
        this.organizationId = config ? config.organization_id : 0;
        this.address = config ? config.address : null;
    };
}