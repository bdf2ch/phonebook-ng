import { Model } from "./model.model";

export interface IOffice {
    id: number;
    organization_id: number;
    address: string | null;
    city: string | null;
}


export class Office extends Model {
    id: number;
    organizationId: number;
    address: string | null;
    city: string | null;

    constructor(config?: IOffice) {
        super();
        this.id = config ? config.id : 0;
        this.organizationId = config ? config.organization_id : 0;
        this.address = config && config.address ? config.address : null;
        this.city = config && config.city ? config.city : null;
    };
}