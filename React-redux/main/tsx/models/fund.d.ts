export default interface Fund {
    fundId: number;
    fundRunnerId: number;
    fundName: string;
    style: string;
    inceptionDate: Date;
    fundAUM : number;
    geographicFocus: string,
    performance : number,
    volatility : number,
    fundAge : number;
    taxEfficiency: string,
    investmentCompanyAUM: number;
    liquidity: number,
    ERISA: string,
    // "leverage" : "leverage",
    // "drawDown" : "drawDown",
    structure: string,
    domicile: string,
    // "InvCompanyName" : "",
}