"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var modal_component_1 = require("./modal.component");
require("rxjs/add/observable/of");
var ModalService = (function () {
    function ModalService() {
        this.modals = [];
    }
    ;
    ModalService.prototype.register = function (modal) {
        this.modals.push(modal);
        return modal;
    };
    ;
    ModalService.prototype.open = function (id) {
        var length = this.modals.length;
        var found = false;
        for (var i = 0; i < length; i++) {
            if (this.modals[i].id === id) {
                this.modals[i].open();
                found = true;
                this.opened = this.modals[i];
            }
            else
                this.modals[i].close(true);
        }
        return found;
    };
    ;
    ModalService.prototype.close = function (withoutCallback) {
        if (this.opened instanceof modal_component_1.ModalComponent)
            this.opened.close(withoutCallback);
    };
    ;
    return ModalService;
}());
ModalService = __decorate([
    core_1.Injectable()
], ModalService);
exports.ModalService = ModalService;
