import { Request, Response, NextFunction } from 'express';
declare type DelayerResult = boolean | Promise<boolean> | number | Promise<number>;
export interface INawdawgOptions {
    delay?: number;
    delayer?(req: Request): DelayerResult;
}
export interface IMiddleware {
    <T>(req: Request & T, res: Response, next: NextFunction): Promise<void>;
}
export default function nawdawg(opts?: number | INawdawgOptions): IMiddleware;
export declare function sleep(ms: number): Promise<void>;
export {};
