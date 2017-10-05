/** Пользовтель. */
export class User {
    /**Логин. */
    public Login: string;
    /**Токен. */
    public Token: string;
    /**Роль. */
    public Role: UserRole;
}

/** Роль пользователя. */
export enum UserRole { Public, User, Admin };