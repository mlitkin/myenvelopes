import { EnvelopePlan } from "../envelope-plan";
import { SafeStyle } from "@angular/platform-browser";

export class EnvelopeViewModel {
    public background: SafeStyle;
    public nameClass: string;
    public currentAmountClass: string;
    public completePercentStr: string;
    public firstPlan: EnvelopePlan;
    public firstPlanIn: EnvelopePlan;
    public firstPlanOut: EnvelopePlan;
    public allPlansForShow: EnvelopePlan[];
    public allPlansAlign: string;
    public allPlansSum: number;
}
