/** Пользовтель. */
export class User {
    /**Логин. */
    public login: string;
    /**Токен. */
    public token: string;
    /**Роль. */
    public role: UserRole;
}

/** Роль пользователя. */
export enum UserRole { Public, User, Admin };