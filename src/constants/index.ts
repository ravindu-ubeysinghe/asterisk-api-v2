export const _500_GENERIC_ERROR: string = 'Something went wrong, please try again later';
export const _500_RECORD_CREATION_FAILED = (model: string): string =>
    `There was something wrong with adding the provided ${model.toLowerCase()} to the database. Please check your entry and submit again`;
