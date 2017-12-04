import { Injectable } from '@angular/core';
import { DivisionTreeComponent } from '../division-tree/division-tree.component';
import { Division } from '../../models/division.model';


@Injectable()
export class DivisionTreeService {
    private trees: DivisionTreeComponent[] = [];


    /**
     * Регистрирует дерево структурных подразделений
     * @param tree {DivisionTreeComponent} - регистрируемый компонент
     */
    register(tree: DivisionTreeComponent): void {
        if (tree) {
            this.trees.push(tree);
            console.log(this.trees);
        }
    };


    /**
     * Поиск дерева структурных подразделений по идентфиикатору
     * @param id {string} - идентификатор дерева структурных подразделений
     * @returns {undefined|DivisionTreeComponent}
     */
    getById(id: string): DivisionTreeComponent|undefined {
        if (id && id !== '') {
            const treeById = (item: any, index: number, trees: DivisionTreeComponent[]) => item.id === id;
            return this.trees.find(treeById);
        }
    };


    addDivision(id: string, division: Division): void {
        this.trees.forEach((item: DivisionTreeComponent, index: number, array: DivisionTreeComponent[]) => {
            if (item.id === id) {
                item.addDivision(division);
            }
        });
    };
}
