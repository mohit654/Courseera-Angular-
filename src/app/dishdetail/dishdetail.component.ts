import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment} from '../shared/comment';

import { Dish } from '../shared/dish';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { visibility, flyInOut, expand } from '../animations/app.animation';

import { DishService } from '../services/dish.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  commentForm: FormGroup;
  comment: Comment;
  
  formErrors = {
    'author': '',
    'comment': ''
  };
  
  validationMessages = {
    'author': {
      'required': 'Author Name is required.',
      'minlength': 'Author Name will be at least 2 characters long',
    },
    'comment': {
      'required': 'comment is required.',
    }
  };

  dish: Dish;
  dishcopy = null;
  dishIds: number[];
  prev: number;
  next: number;
  errMess: string;
  visibility = 'shown';

  constructor(private dishservice: DishService,private route: ActivatedRoute, private location: Location,private fb: FormBuilder,
  @Inject('BaseURL') private BaseURL) {
    this.createForm();
   }

  ngOnInit() {
    this.dishservice.getDishIds()
    .subscribe(dishIds => this.dishIds = dishIds);
    
    this.route.params
    .switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']);})
    .subscribe(dish => { this.dish = dish ; this.dishcopy = dish ; this.setPrevNext(dish.id); this.visibility = 'shown';},
    errmess => this.errMess = <any>errmess);
    //console.log(this.dish);
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['',[Validators.required, Validators.minLength(2)]],
      rating: 5,
      comment: ['',Validators.required],
      date: new Date(),
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages
  }

  onValueChanged(data?: any){
    if(!this.commentForm) { 
      //this.dish.comments.push(this.comment);
      return; }
    const form = this.commentForm;
    //console.log(form.status);
    //this.dish.comments.pop();

    for(const field in this.formErrors){
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    //console.log(this.dish);
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save()
      .subscribe(dish => this.dish = dish);
    //console.log(this.comment);
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: '',
      date: new Date(),
    });
  }

  setPrevNext(dishId : number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }
}
