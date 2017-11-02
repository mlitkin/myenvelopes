/**Отображение значения в статистике баланса периода. */
export class BalanceValue {
    /**Тип значения. */
    public valueType: BalanceValueType;

    /**Наименование значения. */
    public name: string;

    /**Описание значения. */
    public description: string;

    /**Значение показателя. */
    public value: string;
        
    /**Необходимость отображение в хедере панели. */
    public showInHeader: boolean;
}

/** Тип показателя баланса. */
export enum BalanceValueType { 
    /**Текущие остатки. */
    StartSaldo, 
    /**Запланировано поступлений. */
    SumInDebet,
    /**Запланировано отложить. */
    SumIn,
    /**Запланировано потратить. */
    SumOut,
    /**Остаток на конец периода. */
    AvailableSaldo,
    /**Допустимый расход в день. */
    AvailableSaldoByDay,
    /**Можно еще потратить. */
    FreeSum,
    /**Вывод. */
    Conclusion
};
