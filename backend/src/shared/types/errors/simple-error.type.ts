import { GenericError } from "./generic-error.interface";

export interface SimpleError extends GenericError {
    type: 'SimpleError';
}
