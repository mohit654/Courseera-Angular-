import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Http, Response } from '@angular/http';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';
import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';

import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class FeedbackService {

  id: number;

  constructor(private restangular: Restangular, private processHttpmsgService: ProcessHttpmsgService) { }

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    //console.log(feedback);
    return this.restangular.all('feedback').post(feedback);
  }
}

