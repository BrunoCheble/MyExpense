import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams} from 'ionic-angular';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { Device } from 'ionic-native';
import { HomePage } from '../home/home';
import { Expense } from '../../domain/expense/expense';

@Component({
  selector: 'page-form',
  templateUrl: 'form.html'
})
export class FormPage implements OnInit{

	public form: Expense = new Expense();

	public repeatCtrl = false;
	public fixed = false;
	private _udid = 'e192eb3861a79284';//Device.uuid;
	public _Url = 'http://metodistaaguasanta.com.br/app/web/expenses';

  	constructor(
  		public navParams: NavParams, 
  		public navCtrl: NavController, 
  		private _http: Http,
  		private _loadingCtrl : LoadingController,
  		private _alertCtrl : AlertController,
	) {}

  	createExpense() {
  		
  		let errors = this.form.validate();

  		if(errors != ''){

  			this._alertCtrl.create({
				title: 'Erro de validação.',
				subTitle : errors,
				buttons: [{ text : 'Ok' }],
			}).present();

			return false;
  		}

  		let loader = this._loadingCtrl.create({
  			content : 'Cadastrando despesa(s)...'
  		});

  		loader.present();

  		let _headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

  		let _params  = new URLSearchParams(); 		
		_params.set('Expense[title]', this.form.title);		
		_params.set('Expense[value]', this.form.value);		
		_params.set('Expense[due_date]', this.form.due_date);
		_params.set('Expense[status]', this.form.status);
		_params.set('Expense[share_id]', this.form.share_id);
		_params.set('udid', this._udid);

		if(this.repeatCtrl) {

			if(!this.fixed)	
				_params.set('repeat', '120');
			else
				_params.set('repeat', this.form.repeat);
		}
		else
			_params.set('repeat', '1');
		

  		this._http
	    .post(`${this._Url} `, _params.toString(), {headers : _headers})
	    .map(res => res.json())
	    .toPromise()
	    .then(expenses => {
    		loader.dismiss();
  			this.navCtrl.setRoot(HomePage, {date : this.form.due_date, shares: this.navParams.get('shares'), share: this.navParams.get('share')});
    	})
    	.catch(err => {
    		loader.dismiss();
    		
    		let subtitle = '';

    		if(err.status == 400) {

    			let errors = JSON.parse(err._body);

			  	for(let key in errors) {
				   	if(errors.hasOwnProperty(key)){
				    	subtitle += errors[key]+"<br/>";
				   	}
			  	}
    		}
    		else
    			subtitle = 'Falha ao cadastrar a(s) despesa(s)'

    		this._alertCtrl.create({
				title: 'Erro',
				subTitle : subtitle,
				buttons: [{ text : 'Estou ciente.' }],
			}).present();
    	});
  	}

  	modalPropagation() {

  		let alert = this._alertCtrl.create();

	    alert.setTitle('Propagar edição para: ');

	    alert.addInput({
	      type: 'radio',
	      label: 'Editar somente esta despesa',
	      value: '0',
	      checked: true
	    });

	    alert.addInput({
	      type: 'radio',
	      label: 'Todas as despesas pendentes',
	      value: '1',
	    });

	    alert.addInput({
	      type: 'radio',
	      label: 'Todas as próximas despesas',
	      value: '2',
	    });

	    alert.addButton('Cancelar');

	    alert.addButton({
	      text: 'Confirmar',
	      handler: data => {
	        this.updateExpense(data);
	      }
	    });

	    alert.present();

  	}

  	updateExpense(updateAll){
  		
  		let errors = this.form.validate();

  		if(errors != ''){

  			this._alertCtrl.create({
				title: 'Erro de validação.',
				subTitle : errors,
				buttons: [{ text : 'Ok' }],
			}).present();

			return false;
  		}

  		let loader = this._loadingCtrl.create({
  			content : 'Atualizando status da despesa...'
  		});

  		loader.present();

  		let _headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

  		let _params  = new URLSearchParams(); 		
		_params.set('Expense[title]', this.form.title);		
		_params.set('Expense[value]', this.form.value);		
		_params.set('Expense[due_date]', this.form.due_date);
		_params.set('Expense[status]', this.form.status);
		_params.set('Expense[expense_id]', this.form.expense_id);
		_params.set('Expense[share_id]', this.form.share_id);
		_params.set('ExpenseForm[updateAll]', updateAll);
 		
  		this._http
	    .put(`${this._Url}/${this.form.id}`, _params.toString(), {headers : _headers})
	    .map(res => res.json())
	    .toPromise()
	    .then(expenses => {
    		loader.dismiss();

	  		this._alertCtrl.create({
				title: 'Sucesso!',
				subTitle : 'Despesa(s) Atualizada(s) com sucesso.',
				buttons: [{ text : 'Ok' }],
			}).present();

  			this.navCtrl.setRoot(HomePage, {date : this.form.due_date, shares: this.navParams.get('shares'), share: this.navParams.get('share') });
    	})
    	.catch(err => {
    		loader.dismiss();
    		this._alertCtrl.create({
				title: 'Erro',
				subTitle : 'Falha ao atualizar a(s) despesa(s)',
				buttons: [{ text : 'Ok' }],
			}).present();
    	});

  	}

  	ngOnInit() {

  		if(this.navParams.get('form') != undefined){
  			let params = this.navParams.get('form');
  			this.form = new Expense(params.id,params.title,params.value,params.due_date,params.expense_id,params.status);
  		}
  		
  		if(this.navParams.get('date') != undefined)
  			this.form.due_date = this.navParams.get('date');

		if(this.navParams.get('share') != undefined)
  			this.form.share_id = this.navParams.get('share');
  		/*
  		this._alertCtrl.create({
			title: 'Falha na conexão',
			subTitle : 'Não foi possível obter a lista de despesas. Verifique sua conexão e tente novamente.',
			buttons: [{ text : 'Estou ciente' }],
		}).present();
		*/
  	}
}
