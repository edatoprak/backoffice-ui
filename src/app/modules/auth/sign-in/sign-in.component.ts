import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { UserState } from '../../../shared/state/user.state';
import { LoginStateModel } from '../../../shared/state/models/user';
import { Login } from '../../../shared/state/actions/user.action';
import { catchError, skip } from 'rxjs/operators';
import { UserService } from '../../../core/user/user.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
    @Select(UserState.getLogin) login$: Observable<LoginStateModel>;
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        public _activatedRoute: ActivatedRoute,
        public _authService: AuthService,
        public _userService: UserService,
        public _formBuilder: FormBuilder,
        public store: Store,
        public _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [
                'eda.toprak@etiya.com',
                [Validators.required, Validators.email],
            ],
            password: ['', Validators.required],
            rememberMe: [''],
        });
        this.login$.subscribe((data) => {
            if ( data.access_token){
                this._authService.accessToken = data.access_token;
                this._authService._authenticated = true;
                this._userService.user = {
                    id: 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df',
                    name: 'Brian Hughes',
                    email: 'hughes.brian@company.com',
                    avatar: 'assets/images/avatars/brian-hughes.jpg',
                    status: 'online',
                };
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get(
                        'redirectURL'
                    ) || '/product';
                this._router.navigateByUrl(redirectURL);
            }

        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this.store
            .dispatch(
                new Login({
                    email: this.signInForm.get('email').value,
                    password: this.signInForm.get('password').value,
                })
            )
            .pipe(
                catchError((err) => {
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Yanlış Email veya şifre girdiniz!',
                    };

                    // Show the alert
                    this.showAlert = true;
                    return of('');
                })
            );
        /*        this._authService.signIn(this.signInForm.value)
            .subscribe(
                () => {

                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Yanlış Email veya şifre girdiniz!'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );*/
    }
}
