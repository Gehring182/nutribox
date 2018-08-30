import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;

@Injectable()
export class AuthService {

	public user: firebase.User;

	constructor(
		public afAuth: AngularFireAuth
	) {
		afAuth.authState.subscribe(user => {
			this.user = user;
		});
	}

	createAuthUser(user: {email: string, password: string}) {
		this.afAuth.auth.
			createUserWithEmailAndPassword(
				user.email, 
				user.password
		);
	}

	signInWithEmail(credentials: {email: string, password: string}) {
		return this.afAuth.auth.
					signInWithEmailAndPassword(
						credentials.email, 
						credentials.password
				);
	}

	signOut() {
		this.afAuth.auth.signOut();
	}
}