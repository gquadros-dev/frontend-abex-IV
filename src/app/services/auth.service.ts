import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        // Verificar se já está logado (localStorage) - apenas no browser
        if (isPlatformBrowser(this.platformId)) {
            const savedAuth = localStorage.getItem('isAuthenticated');
            if (savedAuth === 'true') {
                this.isAuthenticatedSubject.next(true);
            }
        }
    }

    login(): void {
        this.isAuthenticatedSubject.next(true);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('isAuthenticated', 'true');
        }
    }

    logout(): void {
        this.isAuthenticatedSubject.next(false);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('isAuthenticated');
        }
    }

    get isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }
}

