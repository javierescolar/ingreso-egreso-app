import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { map } from "rxjs/operators";
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class AuthService {

  private subscription: Subscription = new Subscription();

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>
    ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(fbUser => {
      console.log(fbUser);
      if (fbUser){
        this.subscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
            .subscribe(userObj => {
              this.store.dispatch(new SetUserAction(userObj));
            });
      } else {
        this.subscription.unsubscribe();
      }
    });
  }

  crearUsuario(nombre, email, password) {

    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(resp => {
        //console.log(resp);
        const user: User = {
          uid: resp.user.uid,
          nombre: nombre,
          email: resp.user.email,
        };

        this.afDB.doc(`${user.uid}/usuario`)
            .set(user)
            .then(() => this.router.navigate(["/"]))
            .catch(error => {
              Swal.fire("Error en el registro", error.message, "error");
            });
      })
      .catch(error => {
        Swal.fire("Error en el registro", error.message, "error");
      })
      .finally(() => this.store.dispatch(new DesactivarLoadingAction()));
  }

  login(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(resp => {
        //console.log(resp);
        this.router.navigate(["/"]);
      })
      .catch(error => {
        Swal.fire("Error en el login", error.message, "error");
      })
      .finally(() => this.store.dispatch(new DesactivarLoadingAction()));
  }

  logout() {
    this.afAuth.auth
      .signOut()
      .then(resp => {
        //console.log(resp);
        this.router.navigate(["/login"]);
      })
      .catch(error => {
        Swal.fire("Error innesperado", error.message, "error");
      });
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map(fbUser => {
        if (fbUser == null) {
          this.router.navigate(["/login"]);
        }
        return fbUser != null;
      })
    );
  }
}
