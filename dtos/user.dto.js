export class UserDto {
    id;
    email;
    username;
    role;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.username = model.username;
        this.role = model.role;
    }
}
