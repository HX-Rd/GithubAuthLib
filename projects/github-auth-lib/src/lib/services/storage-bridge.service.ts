import { Injectable } from "@angular/core";
import { LocalStorageService } from "angular-2-local-storage";

@Injectable()
export class StorageBrige implements Storage {
    length: number;
    constructor(private localStorageService: LocalStorageService) {
        this.length = localStorageService.length();
    }
    clear(): void {
        this.length = this.localStorageService.length();
        this.localStorageService.clearAll();
    }
    getItem(key: string): string | null {
        let ret = this.localStorageService.get(key);
        if (typeof ret === 'string') {
            return ret;
        }
        return null;
    }
    key(index: number): string | null {
        return this.localStorageService.keys()[index];
    }
    removeItem(key: string): void {
        this.length = this.localStorageService.length();
        this.localStorageService.remove(key);
    }
    setItem(key: string, data: string): void {
        this.length = this.localStorageService.length();
        this.localStorageService.set(key, data);
    }
    [key: string]: any;
    [index: number]: string;
}
