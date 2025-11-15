import { Component, inject } from '@angular/core';
import { ImageSelectorService } from '../../services/image-selector-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-image-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector {
  private imageSelectorService = inject(ImageSelectorService);
  showImageSelector = this.imageSelectorService.showImageSelector.asReadonly();

  imageSelectorUploadForm = new FormGroup({
    file:new FormControl<File | null | undefined>(null,{
      nonNullable: true,
      validators: [Validators.required]
    }),
    name:new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    }),
    title :new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    })
  });

  hideImageSelector(){
    this.imageSelectorService.hideImageSelector();
  }

  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length === 0){
      return
    }
    const file = input.files?.[0];
    this.imageSelectorUploadForm.patchValue({
      file: file
    });
  }

  OnSubmit(){
    if(this.imageSelectorUploadForm.valid){
      const formRawValue = this.imageSelectorUploadForm.getRawValue();
      this.imageSelectorService.uploadImage(formRawValue.file!,formRawValue.name,formRawValue.title).subscribe({
        next: (response)=>{
          console.log('Image uploaded successfully',response);
        },
        error: (error)=>{
          console.error('Error uploading image',error);
        }
      });
    }
  }
}
