/**План конверта. */
export class EnvelopePlan {    
    /**Id. */
    public Id: number;

    /**Дата действия. */
    public ActionDate: Date;
    
    /**Планируемая сумма. Положительное - пополнение конверта. Отрицательная - извлечение из конверта. */
    public PlanAmount: number;

    /**Описание. */
    public Description: string;

    /**= true, если данная запись плана завершена (ее не нужно отображать). */
    public Completed: boolean;

    /**= true, если это поступление в конверт. */
    public IsIncoming: boolean;

    //ViewModel

    public cssClass: string;    
}
