/**Проект. */
export class Project {
    /**Id. */
    public Id: number;

    /**Наименование. */
    public Name: string;

    /**=true, если это основной проект. */
    public IsDefault: boolean;

    /**Начало периода. */
    public PeriodStartDate: Date;

    /**Окончание периода. */
    public PeriodEndDate: Date;
}
