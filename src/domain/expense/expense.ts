
export class Expense {

	public repeat: string = '';

  	constructor(
  	public id: string = '',
	public title: string = '',
	public value: string = '',
	public due_date: string = '',
	public expense_id: string = '',
	public status: string = '',
	public share_id: string = ''
  	) {}

  	public validate(){
  		
  		let errors = '';

  		if (this.title == '') {
  			errors += 'O Título é obrigatório.<br/>';
  		}

  		if (isNaN(Number(this.value)) || Number(this.value) < 1 || this.value == '') {
  			errors += 'O Valor é um campo numérico e obrigatório.<br/>';
  		}

  		if (this.due_date == '') {
  			errors += 'A Data de vencimento é obrigatória.<br/>';
  		}

  		return errors;
  	}
}
