import { Model } from "./model.model";


export interface IATS {
    id: number;
    parent_id: number;
    type: number;
    title: string;
    level: number;
    is_selectable: boolean;
}

export class ATS extends Model {
    id: number;
    parentId: number;
    type: number;
    title: string;
    level: number;
    isSelectable: boolean;

    constructor(config?: IATS) {
        super();
        if (config) {
            this.id = config.id;
            this.parentId = config.parent_id;
            this.type = config.type;
            this.title = config.title;
            this.level = config.level;
            this.isSelectable = config.is_selectable;
        } else {
            this.id = 0;
            this.parentId = 0;
            this.type = 0;
            this.title = '';
            this.level = 0;
            this.isSelectable = true;
        }
    };
};
