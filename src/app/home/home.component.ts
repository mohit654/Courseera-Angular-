import { Component, OnInit , Inject } from '@angular/core';

import { Dish } from '../shared/dish'; 
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion'; 
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader'; 
import { LeaderService } from '../services/leader.service';

import { flyInOut , expand} from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promoErrMess: string;
  leadErrMess: string;
  
  constructor(private dishservice: DishService,private promotionService: PromotionService, private leaderservice: LeaderService,
  @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish = dish,errmess => this.dishErrMess = <any>errmess);
    this.promotionService.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion,errmess => this.promoErrMess = <any>errmess);
    this.leaderservice.getFeaturedLeader().subscribe(leader => this.leader = leader,errmess => this.leadErrMess = <any>errmess);
    //console.log(this.leader);
  }

}
