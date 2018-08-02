import { Injectable } from "@angular/core";
import { LocalStorageService } from "ngx-store";
import { Observable } from "rxjs";

@Injectable()
export class StorageBrige implements Storage {
    length: number;
    constructor(public localStorageService: LocalStorageService) {
        this.length = localStorageService.keys.length;
    }
    clear(): void {
        this.length = this.localStorageService.keys.length;
        this.localStorageService.clear();
    }
    getItem(key: string): string | null {
        let ret = this.localStorageService.get(key);
        if (typeof ret === 'string') {
            return ret;
        }
        return null;
    }
    key(index: number): string | null {
        return this.localStorageService.keys[index];
    }
    removeItem(key: string): void {
        this.length = this.localStorageService.keys.length;
        this.localStorageService.remove(key);
    }
    setItem(key: string, data: string): void {
        this.length = this.localStorageService.keys.length;
        this.localStorageService.set(key, data);
    }
    [key: string]: any;
    [index: number]: string;
}
