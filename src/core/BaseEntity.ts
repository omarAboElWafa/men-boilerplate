class BaseEntity {
    id:string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id : string) {
        this.id = id;
        this.validateId();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    validateId() {
        if (this.id === undefined || this.id === null || this.id === '') {
            throw new Error('Id is required');
        }
    }

    toJSON() {
            return {
                id: this.id,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt
            };
    }
}

export default BaseEntity;