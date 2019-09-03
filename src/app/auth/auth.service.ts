import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { map } from "rxjs/operators";
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore
    ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(fbUser => {
      console.log(fbUser);
    });
  }

  crearUsuario(nombre, email, password) {
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
      });
  }

  login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(resp => {
        //console.log(resp);
        this.router.navigate(["/"]);
      })
      .catch(error => {
        Swal.fire("Error en el login", error.message, "error");
      });
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
