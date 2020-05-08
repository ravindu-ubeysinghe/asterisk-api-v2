export const GENERIC_ERROR: String = 'Something went wrong, please try again later';
export const RECORD_CREATION_FAILED = (model: String): String =>
    `There was something wrong with adding the provided ${model.toLowerCase()} to the database. Please check your entry and submit again`;
