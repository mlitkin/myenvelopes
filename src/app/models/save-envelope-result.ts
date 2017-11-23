import { ClientId } from "./client-id";

export class SaveEnvelopeResult {
    /**Id. */
    public Id: number;
    
    /**Url изображения. */
    public ImageUrl: string;

    /**Идентификаторы созданых планов. */
    public PlanIds: ClientId[];
}
