import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogImage } from '../models/image.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageSelectorService {
  http = inject(HttpClient);
  showImageSelector = signal<boolean>(false);

  displayImageSelector() {
    this.showImageSelector.set(true);
  }
  hideImageSelector() {
    this.showImageSelector.set(false);
  }

  uploadImage(file: File, fileName: string, title: string) : Observable<BlogImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);

    return this.http.post<BlogImage>(`${environment.apiBaseUrl}/api/images`, formData);
  }

}