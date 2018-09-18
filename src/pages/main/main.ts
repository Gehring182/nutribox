import { Component } from '@angular/core';
import { Loading, LoadingController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user/user';
import { AuthService } from '../../providers/auth/auth';
import { EventService } from '../../providers/event/event';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

	cntLastPatientsSignedUp: number;
	lastPatientsSignedUp: string;
	lastPatientsSignedUpNames: string;

	constructor(
		public navCtrl: NavController, 
		public alertCtrl: AlertController,
		public navParams: NavParams,
		public userService: UserService,
		public authService: AuthService,
		public eventService: EventService,
		public loadingCtrl: LoadingController
	) {
		this.cntLastPatientsSignedUp = 0;
		this.lastPatientsSignedUpNames = "";
	}

	ionViewDidLoad() {
		let patients = [];

		this.eventService.getLastUsersSignedUp(this.navParams.get('key'), this.navParams.get('lastSession'))
		.then((doc) => {
			doc.forEach((event) => {
				this.cntLastPatientsSignedUp++;
				patients.push(event.doc.data().uidevent);
			});
		}).then(() => {
			patients.forEach((patient) => {
				this.userService.getUserByUid(patient).then((doc) => {
					this.lastPatientsSignedUpNames += doc.name + " \n ";
				}).then((final) => {
					this.lastPatientsSignedUp = (this.cntLastPatientsSignedUp == 1) ? " paciente se cadastrou." : " pacientes se cadastraram.";
				});
			});
		});
	}

	get MainHeader() {
		let hr = new Date().getHours();
		if (hr > 18 || hr < 4) {
			return "Boa noite, " + this.navParams.get('name');
		}

		if (hr > 12) {
			return "Boa tarde, " + this.navParams.get('name');
		}

		return "Bom dia, " + this.navParams.get('name'); 
	}

	showPatientPrompt() {
		let key = this.navParams.get('key');

		const prompt = this.alertCtrl.create({
			title: 'Novo paciente',
			message: "Por favor, informe o e-mail do paciente:",
		  	inputs: [
		  		{
			    	name: 'name',
			    	placeholder: 'Nome'
			    }, {
			    	name: 'email',
			    	placeholder: 'E-mail'
			    }
		  	],
			buttons: [
				{
					text: 'Cancelar',
				  	handler: data => {}
				}, {
				  	text: 'Confirmar',
				  	handler: data => {
				  		let loading: Loading = this.showLoading()
				  		this.userService.create(Object.assign(data, {nutri: key})).then(
				  			(uid) => {
				  				loading.dismiss();
				  				this.showAlert(data.name);
				            },
				            error => {
				                loading.dismiss();
				            }
				        );
				  	}
				}
			]
		});

		prompt.present();
	}

	logOut() {
		this.userService.update(this.navParams.get('key'), {
			lastSession: new Date
		}).then((bool) => { 
			if (bool) {
				this.authService.signOut();
				this.navCtrl.setRoot(HomePage);	
			}
		});
	}

	showAlert(patientName) {
	    const alert = this.alertCtrl.create({
	      	title: 'Paciente adicionado!',
	      	subTitle: 'Assim que ' + patientName + ' se cadastrar, vocês poderão iniciar o acompanhamento.',
	      	buttons: ['OK']
	    });
	    alert.present();
	}

	showLoading(): Loading {
  		let loading: Loading = this.loadingCtrl.create({
  			content: 'Por favor, aguarde...'
  		});
  		loading.present();
  		return loading;
  	}
}
