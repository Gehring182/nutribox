import { Component } from '@angular/core';
import { Loading, LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../providers/user/user';
import { AuthService } from '../../providers/auth/auth';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {

	signupForm: FormGroup;

  	constructor(
  		public formBuilder: FormBuilder, 
  		public navCtrl: NavController, 
  		public navParams: NavParams,
  		public userService: UserService,
  		public authService: AuthService,
  		public loadingCtrl: LoadingController
  	) {

  		let emailRegularExpression = /^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2,3}/;

  		this.signupForm = this.formBuilder.group({
  			name: ['', [Validators.required, Validators.minLength(3)]],
  			birth: ['', [Validators.required]],
  			email: ['', [Validators.compose([Validators.required, Validators.pattern(emailRegularExpression)])]],
  			crn: ['', [Validators.minLength(5)]],
  			password: ['', [Validators.required, Validators.minLength(6)]]
  		});
  	}

  	onSubmit() {
  		let loading: Loading = this.showLoading();
  		//cria o usuário
  		this.userService.create(this.signupForm.value).then(
  			() => {
  				//cadastra autenticação
  				this.authService.createAuthUser({
		  			email: this.signupForm.value.email,
		  			password: this.signupForm.value.password
		  		});
  				console.log('Usuário cadastrado!');
  				loading.dismiss();
  				this.navCtrl.push(HomePage);
  		});
  	}

  	showLoading(): Loading {
  		let loading: Loading = this.loadingCtrl.create({
  			content: 'Por favor, aguarde...'
  		});

  		loading.present();

  		return loading;
  	}

}