import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { createClaimsTable } from '../utils/claim-utils';
import { TodoService } from '../todo.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{

    loginDisplay = false;
    displayedColumns: string[] = ['claim', 'value', 'description'];
    dataSource: any = [];
    tokenClaimsDataSource: any = [];
    private readonly _destroying$ = new Subject<void>(); 
    public pingResponse: string = '';
    public claimsResponse: string = '';
    public alterTokenResponse: string = '';
    public idTokenClaimsHeader: string = '';

    constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService,private todoService: TodoService) { }

    ngOnInit(): void {
        this.msalBroadcastService.msalSubject$
            .pipe(
                filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
                takeUntil(this._destroying$)
            )
            .subscribe((result: EventMessage) => {
                const payload = result.payload as AuthenticationResult;
                this.authService.instance.setActiveAccount(payload.account);
            });

        this.msalBroadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None),
                takeUntil(this._destroying$)
            )
            .subscribe(() => {
                this.setLoginDisplay();
                this.getIdTokenClaims(this.authService.instance.getActiveAccount()?.idTokenClaims);
            })
    }

    ngOnDestroy(): void {
        this._destroying$.next();
        this._destroying$.complete()
    }


    setLoginDisplay() {
        this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    }

    getIdTokenClaims(claims: any) {
        this.idTokenClaimsHeader = '';
        if (claims) {
            const claimsTable = createClaimsTable(claims);
            this.dataSource = [...claimsTable];
            this.idTokenClaimsHeader = 'idToken Claims';
        }
    }


    public getServerPing(){
        this.pingResponse = ``;
        this.todoService.getPing().subscribe({
            next: responce => {
                if (responce.message){
                    this.pingResponse = responce.message;
                }
                else {
                    this.pingResponse = `unexpected ping error`;
                }
            },
            error: error => {
                this.pingResponse = `error ${error.message}`;
            }
        });
    }

    public getAccessTokenClaims(){
        this.claimsResponse = ``;
        this.todoService.getClaims().subscribe({
            next: claims => {
                if (claims){
                    this.tokenClaimsDataSource = createClaimsTable(claims)
                    this.claimsResponse = `access token claims`;
                }
                else {
                    this.claimsResponse = 'error getting access Token claims !!!';
                    console.log('error getting access Token claims !!!');
                }
            },
            error: error => {
                this.claimsResponse = `get claims error ${error.message}`;
            }
        }); 
    }

    public alterTokenGetClaims(){
        this.todoService.alterTokenGetClaims().subscribe({
            next: claims => {
                if (claims){
                    this.alterTokenResponse = `amount of altered token claims: ${claims.length}`;
                }
                else {
                    this.alterTokenResponse = `unexpected altered token error`;
                }
            },
            error: error => {
                this.alterTokenResponse = `alter token expected error: ${error.message}`;
            }
        });
    }
}
