import { Document } from 'mongoose';

interface Service<T> {
    get(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    getByQuery(query: Object): Promise<T | boolean | null>;
    create(object: T): Promise<T>;
    delete(id: string): Promise<boolean>;
    deleteAll(): Promise<boolean>;
}

export default Service;
