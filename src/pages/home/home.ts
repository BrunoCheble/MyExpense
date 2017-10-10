import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController} from 'ionic-angular';
import { Http, URLSearchParams, Headers } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
	
	public filter: string = new Date().toISOString();
	private _now: string = new Date().toISOString();
	private _Url = 'http://localhost/WSMyExpense/web/expenses';

	public items;
	public total_expense;

  	constructor(
  		public navCtrl: NavController, 
  		private _http: Http,
  		private _loadingCtrl : LoadingController,
  		private _alertCtrl : AlertController
	) {}

  	ngOnInit() {
  		this.listExpenses();	
  	}

  	public listExpenses() {

  		let loader = this._loadingCtrl.create({
  			content : 'Buscando despesas atualizadas...'
  		});

  		loader.present();

  		let _search = new URLSearchParams();
  		_search.set('ExpenseSearch[due_date]', this.filter);

  		this._http
	    .get(this._Url,{ search : _search })
	    .map(res => res.json())
	    .toPromise()
	    .then(expenses => {
    		this.items = expenses;
    		this.setTotalExpense();
    		loader.dismiss();
    	})
    	.catch(err => {
    		loader.dismiss();
    		this.connectionFailed(err);
    	});
  	}

  	public setTotalExpense() {

  		let total_expense : number = 0;

  		this.items.forEach(function(item){
  			if(item.status != 'PAGO')
  				total_expense += Number(item.value);
  		});

  		this.total_expense = total_expense;
  	}

  	public changeFilter() {
  		this.listExpenses();
  	}

  	public editItem(item) {
  		console.log(item);
  	}

  	public deleteItem(item) {
  		
  		let _headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
  		
  		let loader = this._loadingCtrl.create({
  			content : 'Deletando despesa...'
  		});

  		loader.present();

  		this._http
	    .delete(`${this._Url}/${item.id}`, {headers : _headers})
	    .map(res => res.json())
	    .toPromise()
	    .then(expenses => {
    		loader.dismiss();
    		this.listExpenses();
    	})
    	.catch(err => {
    		loader.dismiss();    		
    		this.connectionFailed(err);
    	});

  	}

  	public connectionFailed(err) {

		console.log(err);

  		this._alertCtrl.create({
			title: 'Falha na conexão',
			subTitle : 'Não foi possível obter a lista de despesas. Verifique sua conexão e tente novamente.',
			buttons: [{ text : 'Estou ciente' }],
		}).present();
  	}

  	public updateStatusItem(item) {

  		let loader = this._loadingCtrl.create({
  			content : 'Atualizando status da despesa...'
  		});

  		loader.present();

  		let _headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
  		let _params  = new URLSearchParams(); 		
  		let status   = 'PENDENTE';

  		if(item.status == 'PENDENTE') {  
  			status = 'PAGO';
  		}

		_params.set('Expense[status]', status);
 		
  		this._http
	    .put(`${this._Url}/${item.id}`, _params.toString(), {headers : _headers})
	    .map(res => res.json())
	    .toPromise()
	    .then(expenses => {
    		item.status = status;
    		this.setTotalExpense();
    		loader.dismiss();
    	})
    	.catch(err => {
    		loader.dismiss();    		
    		this.connectionFailed(err);
    	});

  	}
}
