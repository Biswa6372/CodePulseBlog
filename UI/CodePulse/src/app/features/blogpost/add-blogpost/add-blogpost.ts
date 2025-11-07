import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPostService } from '../services/blog-post-service';
import { AddBlogPostRequest } from '../models/blogpost.model';
import { Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-add-blogpost',
  imports: [ReactiveFormsModule,MarkdownComponent],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css',
})
export class AddBlogpost {
  blogPostService = inject(BlogPostService);
  router = inject(Router);

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
    })
  });

  onSubmit(): void {
    const fromRawValue = this.addBlogPostForm.getRawValue();
    const requestDto : AddBlogPostRequest = {
      title: fromRawValue.title,
      shortDescription: fromRawValue.shortDescription,
      content: fromRawValue.content,
      featuredImageUrl: fromRawValue.featuredImageUrl,
      urlHandle: fromRawValue.urlHandle,
      publishedDate: new Date(fromRawValue.publishedDate),
      author: fromRawValue.author,
      isVisible: fromRawValue.isVisible,
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
