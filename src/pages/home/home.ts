import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams} from 'ionic-angular';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { LocalNotifications, Device } from 'ionic-native';
import { FormPage } from '../form/form';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
	
	public filter: string = new Date().toISOString();
	public _now: string = new Date().toISOString();
	public _Url = 'http://metodistaaguasanta.com.br/app/web/expenses';
	private _udid = 'e192eb3861a79284';//Device.uuid;
	public items;
	public share;
	public shares;
	public total_expense;

  	constructor(
  		public navParams: NavParams, 
  		public navCtrl: NavController, 
  		private _http: Http,
  		private _loadingCtrl : LoadingController,
		private _alertCtrl : AlertController,
	) {}

  	ngOnInit() {
		  		
  		if(this.navParams.get('date') != undefined)
  			this.filter = this.navParams.get('date');
		
		if(this.navParams.get('shares') != undefined) {
			this.shares = this.navParams.get('shares');
			this.share  = this.navParams.get('share');
		}
			  
  		this.listExpenses();	
	}

	public listExpenses() {

  		let loader = this._loadingCtrl.create({
  			content : 'Buscando despesas atualizadas...'
  		});

  		loader.present();

  		let _search = new URLSearchParams();
  		_search.set('ExpenseSearch[due_date]', this.filter);
  		_search.set('ExpenseSearch[share_id]', this.share);
		_search.set('udid', this._udid);
		  
  		this._http
	    .get(this._Url,{ search : _search })
	    .map(res => res.json())
	    .toPromise()
	    .then(expenses => {
    		this.items = expenses;
    		this.setTotalExpense();

    		//LocalNotifications.clearAll();

    		this.items.forEach(function(item){

    			if(item.status == 'PENDENTE') {

    				let dateStr = new Date().toISOString();
	    			let now = dateStr.split("T")[0];

    				if(new Date(item.due_date).toISOString() === new Date(now).toISOString()) {

    					LocalNotifications.schedule({
				            title: item.title,
				            text: 'O pagamento é hoje.',
				            at: new Date(new Date().getTime() + 5 * 1000),
							id: item.id,
				            sound: null
				        });

    				}
		  			else if(new Date(item.due_date).toISOString() < new Date(now).toISOString()) {

		  				LocalNotifications.schedule({
				            title: item.title,
				            text: 'Pagamento atrasado desde '+item.due_date,
				            at: new Date(new Date().getTime() + 5 * 1000),
				            id: item.id,
				            sound: null
				        });
		  			}
    			}
	  			
	  		});

    		loader.dismiss();
    	})
    	.catch(err => {
    		loader.dismiss();
    	});
	}
	  
	  
	public doRefresh(refresher) {
		
		this.changeFilter();
		
		setTimeout(() => {
			refresher.complete();
		}, 500);
	}

  	public notification(title,text) {

  		LocalNotifications.schedule({
            title: title,
            text: text,
            at: new Date(new Date().getTime() + 5 * 1000),
            sound: null
        });
  	}

  	public setTotalExpense() {

  		let total_expense : number = 0;

  		this.items.forEach(function(item){
  			//if(item.status != 'PAGO')
  				total_expense += Number(item.value);
  		});

  		this.total_expense = total_expense;
  	}

  	public changeFilter() {
  		this.listExpenses();
	}

  	public editExpense(expense) {
  		this.navCtrl.push(FormPage, {form : expense, share: this.share, shares: this.shares});
  	}

  	public createExpense() {  		
  		this.navCtrl.push(FormPage, {date : this.filter, share: this.share, shares: this.shares});
  	}

  	public log() {
  		console.log('teste');
  	}

  	public deleteExpense(item) {
		  
		let alert = this._alertCtrl.create();

		if(item.status == 'PAGO')
			alert.setTitle('Você tem certeza que deseja deletar essa despesa ?');
		else
			alert.setTitle('Você tem certeza que deseja deletar essa despesa e as de mais pendentes do mesmo tipo?');

		alert.addButton('Não!');
		
		alert.addButton({
			text: 'Estou ciente',
			handler: data => {
			
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
		});
		
	    alert.present();
  	}

  	public connectionFailed(err) {

		console.log(err);

  		this._alertCtrl.create({
			title: 'Falha na conexão',
			subTitle : 'Não foi possível obter a lista de despesas. Verifique sua conexão e tente novamente.',
			buttons: [{ text : 'Estou ciente' }],
		}).present();
  	}

  	public updateStatusExpense(item) {

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
