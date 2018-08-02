import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingViewService {
  public loadingView: TemplateRef<any>;

  constructor() { }
}
