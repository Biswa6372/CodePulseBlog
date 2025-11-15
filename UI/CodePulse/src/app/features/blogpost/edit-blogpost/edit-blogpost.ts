import { ImageSelector } from './../../../shared/components/image-selector/image-selector';
import { Component, effect, inject, input } from '@angular/core';
import { BlogPostService } from '../services/blog-post-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';
import { UpdateBlogPostRequest } from '../models/blogpost.model';
import { Router } from '@angular/router';
import { ImageSelectorService } from '../../../shared/services/image-selector-service';

@Component({
  selector: 'app-edit-blogpost',
  imports: [ReactiveFormsModule,MarkdownComponent,ImageSelector],
  templateUrl: './edit-blogpost.html',
  styleUrl: './edit-blogpost.css',
})
export class EditBlogpost {
  id = input<string>();
  blogPostService = inject(BlogPostService);
  categoryService = inject (CategoryService);
  imageSelectorService = inject(ImageSelectorService);
  router = inject(Router);
  private blogPostRef = this.blogPostService.getBlogPostById(this.id);
  blogPostResponse = this.blogPostRef.value;

  private categoriesRef = this.categoryService.getAllCategories();
  categoriesResponse = this.categoriesRef.value;

  editBlogPostForm = new FormGroup({
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

  effectRef = effect(() => {
    if(this.blogPostResponse()){
      this.editBlogPostForm.patchValue({
      title: this.blogPostResponse()?.title,
      shortDescription: this.blogPostResponse()?.shortDescription,
      content: this.blogPostResponse()?.content,
      featuredImageUrl: this.blogPostResponse()?.featuredImageUrl,
      urlHandle: this.blogPostResponse()?.urlHandle,
      publishedDate: new Date(this.blogPostResponse()?.publishedDate!).toISOString().split('T')[0],
      author: this.blogPostResponse()?.author,
      isVisible: this.blogPostResponse()?.isVisible,
      categories: this.blogPostResponse()?.categories.map(c => c.id)
    })
    }
    
  })

  onSubmit(): void {
    const id = this.id();
    if (id && this.editBlogPostForm.valid) {
      const fromValue = this.editBlogPostForm.getRawValue();

    const updateBlogPostRequestDto : UpdateBlogPostRequest = {
      title: fromValue.title,
      shortDescription: fromValue.shortDescription,
      content: fromValue.content,
      featuredImageUrl: fromValue.featuredImageUrl,
      urlHandle: fromValue.urlHandle,
      publishedDate: new Date(fromValue.publishedDate),
      author: fromValue.author,
      isVisible: fromValue.isVisible,
      categories: fromValue.categories ?? []
    }
    this.blogPostService.editBlogPost(id, updateBlogPostRequestDto).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/blogposts']);
      },
      error: (error) => {
        console.error(`Error updating blog post for this id ${id}:`, error);
      }
    });
    }
  }

  onDelete(): void {
    const id = this.id();
    if (id) {
      this.blogPostService.deleteBlogPost(id).subscribe({
        next: (response) => {
          this.router.navigate(['/admin/blogposts']);
        },
        error: (error) => {
          console.error(`Error deleting blog post for this id ${id}:`, error);
        }
      });
    }
  }

  openImageSelector() {
    this.imageSelectorService.displayImageSelector();
  }

}
