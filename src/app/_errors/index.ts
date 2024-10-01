export class FetchMetadataError extends Error {
    constructor() {
        super('An error has ocurred while fetching the NFT(s). Please try again.');
    }
}

export class EmptyMetadataError extends Error {
    constructor() {
        super("We couldn't find any NFT(s) with the provided ID(s).");
    }
}

export class UnsupportedTraitsError extends Error {
    constructor() {
        super(
            'The NFT(s) you requested to load have unsupported traits, and cannot be used at this time.'
        );
    }
}

export class OrderError extends Error {
    constructor(message: string) {
        super(message);
    }
}
