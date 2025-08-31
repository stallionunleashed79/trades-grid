export interface TradeFilter {
    symbol?: string;
    status?: string;
    side?: string;
    tradeDateBegin?: Date;
    tradeDateEnd?: Date;
}