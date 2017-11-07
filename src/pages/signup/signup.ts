import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController} from 'ionic-angular';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { Device } from 'ionic-native';
import { HomePage } from '../home/home';
import { User } from '../../domain/user/user';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage implements OnInit{

	public form: User = new User();
	
	private _udid = 'e192eb3861a79284';//Device.uuid;
	public _Url = 'http://metodistaaguasanta.com.br/app/web/users';

  	constructor(
  		public navCtrl: NavController, 
  		private _http: Http,
  		private _loadingCtrl : LoadingController,
  		private _alertCtrl : AlertController,
	) {}

  	createUser() {
		  
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
  			content : 'Estamos te cadastrando...'
  		});

  		loader.present();

  		let _headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

  		let _params  = new URLSearchParams(); 		
		_params.set('User[email]', this.form.email);		
		_params.set('User[name]', this.form.name);
		_params.set('User[udid]', this._udid);

  		this._http
	    .post(`${this._Url} `, _params.toString(), {headers : _headers})
	    .map(res => res.json())
	    .toPromise()
	    .then(data => {
    		loader.dismiss();
			if(data != ''){
				this.navCtrl.setRoot(HomePage, {shares : data.shares, share: data.share});
			}
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
    			subtitle = 'Houve um problema ao finalizar o cadastro...'

    		this._alertCtrl.create({
				title: 'Erro',
				subTitle : subtitle,
				buttons: [{ text : 'Estou ciente.' }],
			}).present();
    	});
  	}

  	ngOnInit() {

		if(this._udid == 'null') {

			this._alertCtrl.create({
				title: 'Erro',
				subTitle : 'Não foi possível identificar seu celular',
				buttons: [{ text : 'Estou ciente.' }],
			}).present();

			return false;
		}

		let loader = this._loadingCtrl.create({
			content : 'Autenticando...'
		});

		loader.present();


		let _search = new URLSearchParams();
		_search.set('udid', this._udid);
		
		this._http
	    .get(this._Url,{ search : _search })
	    .map(res => res.json())
	    .toPromise()
	    .then(data => {
			loader.dismiss();
			if(data != ''){
				this.navCtrl.setRoot(HomePage, {shares : data.shares, share: data.share});
			}
    	})
    	.catch(err => {
			loader.dismiss();
			
			if(err.status == 400) {

				let subtitle = '';
				let errors = JSON.parse(err._body);

				for(let key in errors) {
					if(errors.hasOwnProperty(key)){
					subtitle += errors[key]+"<br/>";
					}
				}

				this._alertCtrl.create({
					title: 'Erro',
					subTitle : subtitle,
					buttons: [{ text : 'Estou ciente.' }],
				}).present();
			}			
    	});
  	}
}
