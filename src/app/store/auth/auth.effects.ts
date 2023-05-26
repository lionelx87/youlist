import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { CustomMessageType } from 'src/app/core/models/message.interface';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CustomMessageService } from 'src/app/shared/services/custom-message.service';
import { AppState } from '../app.reducer';
import { hideLoading, showLoading } from '../ui/ui.actions';
import {
  registerUser,
  registerUserFail,
  registerUserSuccess,
} from './auth.actions';
import { CustomRoutingService } from 'src/app/core/services/custom-routing.service';
import { CustomRoute } from 'src/app/core/models/routing.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private customMessageService: CustomMessageService,
    private store: Store<AppState>,
    private translateService: TranslateService,
    private customRoutingService: CustomRoutingService
  ) {}

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      tap(() => this.store.dispatch(showLoading())),
      mergeMap(action =>
        this.authService.register(action.user).pipe(
          map(success =>
            success
              ? registerUserSuccess()
              : registerUserFail({ error: { code: 'generic' } })
          ),
          catchError(err => {
            return of(registerUserFail({ error: err.code }));
          }),
          finalize(() => this.store.dispatch(hideLoading()))
        )
      )
    )
  );

  registerUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerUserSuccess),
        tap(() => {
          this.customRoutingService.go(CustomRoute.LOGIN);
          this.customMessageService.showMessage({
            type: CustomMessageType.SEVERITY_SUCCESS,
            title: 'Registro',
            content: 'Usuario registrado correctamente',
          });
        })
      ),
    { dispatch: false }
  );

  registerUserFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerUserFail),
        switchMap(action =>
          this.translateService.get('auth.form.errors.' + action.error)
        ),
        tap(translate =>
          this.customMessageService.showMessage({
            type: CustomMessageType.SEVERITY_ERROR,
            title: 'Error',
            content: translate,
          })
        )
      ),
    { dispatch: false }
  );
}
