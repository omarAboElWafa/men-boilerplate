// Define the db entity of your component.
import  BaseEntity  from '../../core/BaseEntity';

class Example extends BaseEntity{
    prop1: string;
    prop2: number;
    prop3: boolean;
    constructor(prop1: string, prop2: number, prop3: boolean) {
        super(prop1);
        this.prop1 = prop1;
        this.prop2 = prop2;
        this.prop3 = prop3;
    }
}

export default Example;