import { action, reaction, observable, computed } from "mobx"
let runningId: number = 1;

class Todo {
    id: number = runningId++;

    @observable
    name: string = '';
    @observable
    isCompleted: boolean = false;

    private disposer: () => void;;
    constructor(name: string) {
        this.name = name;

        this.disposer = reaction(() => { this.isCompleted }, () => {

            console.log(`Todo: ${this.name}, Changed To: ${this.isCompleted ? 'Done' : 'Incomplete'}`)
        })
    }

    @action
    toggleTodo() {
        this.isCompleted = !this.isCompleted;
    }

    @action
    updateName(name: string) {
        this.name = name;
    }

    dispose() {
        this.disposer()
    }

}


class TodoList {
    @observable
    list: Todo[] = [];

    constructor() {
        reaction(() => this.list.length, () => { console.log(this.list.length) })
    }


    @action
    addTodo(name: string) {
        this.list.push(new Todo(name));
    }


    @action
    removeTodo(id: number) {
        const todoToRomeve = this.list.find((todo) => todo.id === id);
        if (todoToRomeve) {
            todoToRomeve.dispose();
            this.list.splice(this.list.indexOf(todoToRomeve), 1)
        }
    }

    @computed
    get completed() {
        return this.list.filter((todo) => todo.isCompleted === true)
    }

    @computed
    get inCompleted() {
        return this.list.filter((todo) => todo.isCompleted === false)
    }

}

