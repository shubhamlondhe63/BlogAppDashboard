import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard : boolean = false;

  constructor( 
    private auth: AngularFireAuth, 
    private toastr :  ToastrService, 
    private router: Router) { }


  login(email, password){
    this.auth.signInWithEmailAndPassword( email, password).then(() =>{
      this.toastr.success(" Logged In Successfully...");
      this.loadUser();
      this.loggedIn.next(true);
      this.isLoggedInGuard = true;
      this.router.navigate(['/']);
    }).catch(e =>{
      this.toastr.warning(e);
    })
  }


  loadUser(){
    this.auth.authState.subscribe(user =>{
      localStorage.setItem('user', JSON.stringify(user));
    })
  }


  logout(){
    this.auth.signOut().then(( )=>{
        this.toastr.success("Your are successfully logout")
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        this.loggedIn.next(false);
        this.isLoggedInGuard = false;
    })
  }


  isLoggedIn(){
    return this.loggedIn.asObservable();
  }

}
