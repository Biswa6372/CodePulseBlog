import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPostService } from '../services/blog-post-service';
import { AddBlogPostRequest } from '../models/blogpost.model';
import { Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';
import { ImageSelectorService } from '../../../shared/services/image-selector-service';
import { ImageSelector } from '../../../shared/components/image-selector/image-selector';

@Component({
  selector: 'app-add-blogpost',
  imports: [ReactiveFormsModule,MarkdownComponent],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css',
})
export class AddBlogpost {
  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  imageSelectorService = inject(ImageSelectorService)
  private categoriesResourceRef = this.categoryService.getAllCategories();
  categoriesResponse = this.categoriesResourceRef.value;

  selectedImageEffectRef = effect(() =>{
    const selectedImageUrl= this.imageSelectorService.selectedImage();
    if(selectedImageUrl){
      this.addBlogPostForm.patchValue({
        featuredImageUrl : selectedImageUrl
      })
    } 
  })

  addBlogPostForm = new FormGroup({
    title: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10),Validators.maxLength(100)]
    }),
    shortDescription: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10),Validators.maxLength(300)]
    }),
    content: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)]
    }),
    featuredImageUrl: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required,Validators.maxLength(200)]
    }),
    urlHandle: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required,Validators.maxLength(200)]
    }),
    publishedDate: new FormControl<string>(new Date().toISOString().split('T')[0],{
      nonNullable: true,
      validators: [Validators.required]
    }),
    author: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required,Validators.maxLength(100)]
    }),
    isVisible: new FormControl<boolean>(true,{
      nonNullable: true,
    }),
    categories: new FormControl<string[]>([])
  });

  onSubmit(): void {
    const fromRawValue = this.addBlogPostForm.getRawValue();
    console.log('Form Submitted:', fromRawValue);
    const requestDto : AddBlogPostRequest = {
      title: fromRawValue.title,
      shortDescription: fromRawValue.shortDescription,
      content: fromRawValue.content,
      featuredImageUrl: fromRawValue.featuredImageUrl,
      urlHandle: fromRawValue.urlHandle,
      publishedDate: new Date(fromRawValue.publishedDate),
      author: fromRawValue.author,
      isVisible: fromRawValue.isVisible,
      categories: fromRawValue.categories ?? []
    };

    this.blogPostService.createBlogPost(requestDto).subscribe({
      next: (response) => {
        console.log('Blog post created successfully:', response);
        this.router.navigate(['/admin/blogposts']);
      },
      error: (error) => {
        console.error('Error creating blog post:', error);
      },
    });
  }
}
