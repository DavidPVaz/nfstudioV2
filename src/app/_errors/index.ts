class ApiError extends Error {
    code?: number;

    constructor(message: string, code?: number) {
        super(message);
        this.code = code;
    }
}
export class FetchMetadataError extends ApiError {
    constructor() {
        super('An error has ocurred while fetching the NFT(s). Please try again.');
    }
}

export class EmptyMetadataError extends ApiError {
    constructor() {
        super("We couldn't find any NFT(s) with the provided ID(s).");
    }
}

export class UnsupportedTraitsError extends ApiError {
    constructor() {
        super(
            'The NFT(s) you requested to load have unsupported traits, and cannot be used at this time.'
        );
    }
}

export class OrderError extends ApiError {
    constructor(message: string, code: number) {
        super(message, code);
    }
}
