import { SafeStyle } from "@angular/platform-browser";
import { EnvelopePlan } from "./envelope-plan";
import { EnvelopeViewModel } from "./view-models/envelope-view-model";

/**Конверт. */
export class Envelope {
    constructor() {
        this.Plans = [];
        this.viewModel = new EnvelopeViewModel();
    }

    /**Id. */
    public Id: number;

    /**Id проекта. */
    public ProjectId: number;

    /**Наименование проекта. */
    public ProjectName: string;
        
    /**Наименование. */
    public Name: string;

    /**Описание. */
    public Description: string;

    /**Общая сумма в конверте на текущий момент. */
    public CurrentAmount: number;

    /**Целевая сумма конверта (которую нужно накопить). */
    public TargetAmount: number;
    
    /**= true, если конверт дебетовый. */
    public IsDebet: boolean;

    /**= true, если конверт используется. */
    public Enabled: boolean;

    /**= true, если текущая сумма конверта не влияет на баланс. */
    public IsExternalCurrentAmount: boolean;

    /**Url изображения. */
    public ImageUrl: string;

    /**Список планов. */
    public Plans: EnvelopePlan[];

    /**Список Id планов для удаления. */
    public DeletedPlanIds: number[];
        
    /**ViewModel. */
    public viewModel: EnvelopeViewModel;
}
