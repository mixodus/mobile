import { ShellModel } from '../shell/data-store';

export class ProductModel extends ShellModel {

    status: boolean;
    message: string;
    data: Array<{ id: string, name: string, price: number, description: string, category: string, amount: number }> = []

    constructor() {
        super();
    }
}
