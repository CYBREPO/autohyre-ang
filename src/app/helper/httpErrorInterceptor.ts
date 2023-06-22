import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../service/loader.service';
import { ModalDialogService } from '../service/modal-dialog.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private loaderService: LoaderService,
        private modalDialogService: ModalDialogService) {
        this.router = router;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                // clear the localStorage and call the logout method
                this.logout();
                this.modalDialogService.error("Unauthorized, The user session has ended. Kindly login again.")
                this.loaderService.display(false);
            }
            else if (err.status === 403) {
                // this.modalDialogService.error(err.error.Message);
                this.loaderService.display(false);
            }
            else if (err.status === 400 && err.error.Message != "" && err.error.Message != null && err.error != null) {
                // this.modalDialogService.error(err.error.Message);
                this.loaderService.display(false);
            }
            else if (err.status === 406) {
                this.modalDialogService.error("Invalid Entry");
                this.loaderService.display(false);
            }
            else if (err.status === 422) {
                // this.modalDialogService.error("Kindly mention Employee-Id");
                this.loaderService.display(false);
            }
            else if (err.status === 402) {
                this.loaderService.display(false);
                return throwError(err);
            }
            const error = err.error != null && err.error.Message != null ? err.error.Message : err.statusText;
            this.loaderService.display(false);
            return throwError(error);
        }))
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.router.navigate(['account/login']);
    }
}