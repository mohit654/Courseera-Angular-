import { Component, OnInit , Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';


import { visibility, flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
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
export class ContactComponent implements OnInit {

  
  feedbackForm: FormGroup;
  feedback: Feedback;
  submitted = null;
  showForm = true;
  contactType = ContactType;
  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First Name is required.',
      'minlength': 'First Name will be at least 2 characters long',
      'maxlength': 'First Name cannot be more than 25 characters long',
    },
    'lastname': {
      'required': 'Last Name is required.',
      'minlength': 'Last Name will be at least 2 characters long',
      'maxlength': 'Last Name cannot be more than 25 characters long',
    },
    'telnum': {
      'required': 'Tel. Number is required.',
      'pattern': 'Tel. number must contain only numbers.',
    },
    'email': {
      'required': 'email is required.',
      'email': 'Email not in valid format',
    }
  };

  constructor(private feedbackservice: FeedbackService,private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25) ]],
      lastname: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25) ] ],
      telnum: ['',[Validators.required, Validators.pattern ]],
      email: ['',[Validators.required, Validators.email ]],
      agree: false,
      contacttype: 'None',
      message: '',
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages
  }

  onValueChanged(data?: any){
    if(!this.feedbackForm) { return; }
    const form = this.feedbackForm;

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
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.showForm = false;
    this.feedbackservice.submitFeedback(this.feedback)
      .subscribe(feedback => {
         this.submitted = feedback;
         this.feedback = null; 
         setTimeout(() => { this.submitted = null; this.showForm = true; }, 5000); 
        },
        error => console.log(error.status, error.message));
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    
  }
}
