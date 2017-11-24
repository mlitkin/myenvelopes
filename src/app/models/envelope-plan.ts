import { EnvelopePlanViewModel } from "./view-models/envelope-plan-view-model";

/**План конверта. */
export class EnvelopePlan {    
    constructor() {
        this.viewModel = new EnvelopePlanViewModel();
    }

    /**Id. */
    public Id: number;

    /**ClientId. */
    public ClientId: string;
        
    /**Дата действия. */
    public ActionDate: Date | string;
    
    /**Планируемая сумма. Положительное - пополнение конверта. Отрицательная - извлечение из конверта. */
    public PlanAmount: number;

    /**Описание. */
    public Description: string;

    /**= true, если данная запись плана завершена (ее не нужно отображать). */
    public Completed: boolean;

    /**= true, если это поступление в конверт. */
    public IsIncoming: boolean;

    /**ViewModel. */
    public viewModel: EnvelopePlanViewModel;
}
