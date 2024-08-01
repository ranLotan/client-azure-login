import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Todo } from './todo';

import { protectedResources } from './auth-config';

@Injectable({
    providedIn: 'root'
})
export class TodoService {

    url = protectedResources.apiTodoList.endpoint;

    constructor(private http: HttpClient) { }

    getTodos() {
        return this.http.get<Todo[]>(this.url);
    }

    getTodo(id: number) {
        return this.http.get<Todo>(this.url + '/' + id);
    }

    getClaims() {
        return this.http.get<any>(this.url + '/getClaims');
    }
    alterTokenGetClaims() {
        const headers = new HttpHeaders().set('x-Flatten', 'true');
        const request =  this.http.get<any>(`${this.url}/getClaims`, { headers });
        return request;
    }
    getPing() {
        return this.http.get<any>(this.url + '/getPing');
    }

    postTodo(todo: Todo) {
        return this.http.post<Todo>(this.url, todo);
    }

    deleteTodo(id: number) {
        return this.http.delete(this.url + '/' + id);
    }

    editTodo(todo: Todo) {
        return this.http.put<Todo>(this.url + '/' + todo.id, todo);
    }
}
