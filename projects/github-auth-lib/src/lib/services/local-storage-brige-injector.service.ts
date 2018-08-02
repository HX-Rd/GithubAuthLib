import { Injectable } from "@angular/core";
import { StorageBrige } from "./storage-bridge.service";
import { LocalStorageService } from "ngx-store";

@Injectable()
export class LocalStorageBrigeInjector {
    private static instance: StorageBrige = null;

    // Return the instance of the service
    public static getInstance(localStorageService: LocalStorageService): StorageBrige {
        if (LocalStorageBrigeInjector.instance === null) {
            LocalStorageBrigeInjector.instance = new StorageBrige(localStorageService);
        }
        return LocalStorageBrigeInjector.instance;
    }

    constructor(
        private localStorageService: LocalStorageService,
    ) { }
}
