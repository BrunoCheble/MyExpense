
export class User {

  	constructor(
	public name: string = '',
	public email: string = '',
  	) {}

  	public validate(){
  		
  		let errors = '';

  		if (this.name == '') {
  			errors += 'O Nome é obrigatório.<br/>';
  		}

  		if (this.email == '') {
  			errors += 'O E-mail é obrigatório.<br/>';
  		}

  		return errors;
  	}
}
