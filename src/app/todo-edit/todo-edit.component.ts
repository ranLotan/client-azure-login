import { TodoService } from './../todo.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {createClaimsTable} from '../utils/claim-utils';

import { Todo } from '../todo';

@Component({
    selector: 'app-todo-edit',
    templateUrl: './todo-edit.component.html',
    styleUrls: ['./todo-edit.component.css']
})
export class TodoEditComponent implements OnInit {

    todo: Todo = {
        id: 1,
        description: "undefined",
        status: false,
    };
    tokenClaimsDataSource: any[] = [];
    displayedColumns: string[] = ['claim', 'value', 'description'];

    constructor(private route: ActivatedRoute, private router: Router, private service: TodoService) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            let id = +params.get('id')!;
            this.service.getTodo(+id).subscribe((response: Todo) => {
                this.todo = response;
            })
        })
    }

    editTodo(todo: Todo): void {
        this.todo.description = todo.description;
        this.service.editTodo(this.todo).subscribe(() => {
            this.router.navigate(['/todo-view']);
        })
    }

    public getAccessTokenClaims(){
        this.service.getClaims().subscribe(claims => {
            if (claims){
                const accesTokenClaimsTable = createClaimsTable(claims)
                this.tokenClaimsDataSource = accesTokenClaimsTable;
            }
            else {
                console.log('error getting access Token claims !!!');
            }
        }); 
    }
}
