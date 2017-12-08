import { Model } from "./model.model";

export interface IOffice {
    id: number;
    organization_id: number;
    address: string;
}


export class Office extends Model {
    id: number;
    organizationId: number;
    address: string | null;

    constructor(config?: IOffice) {
        super();
        this.id = config ? config.id : 0;
        this.organizationId = config ? config.organization_id : 0;
        this.address = config ? config.address : null;
    };
}