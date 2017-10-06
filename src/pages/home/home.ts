import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, URLSearchParams } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	
	public filter: string = new Date().toISOString();

	public items;

  	constructor(public navCtrl: NavController, private _http: Http) {
  		this.listExpenses();
  	}

  	public listExpenses() {

  		let _search = new URLSearchParams();
  		_search.set('ExpenseSearch[due_date]', this.filter);

  		this._http
	    .get('http://localhost/lembrete/web/expenses',{ search : _search })
	    .map(res => res.json())
	    .toPromise()
	    .then(
	    	expenses => {this.items = expenses},
	    	err => {console.log(err)}
    	);
  	}
  	/*
  	public getTotal() {
  		
  		let total: number = 0;

  		this.items.forEach(function(item){
  			if(item.status != 'PAGO')
  				total += Number(item.value);
  		});

  		return total;
  	}*/

  	public changeFilter() {
  		this.listExpenses();
  	}

  	public itemSelected(item) {
  		console.log(item);
  	}
}
