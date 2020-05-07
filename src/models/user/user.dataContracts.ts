export interface CreateUserRequest {
    name: String;
    email: String;
    password: String;
    phone: Number;
    address: {
        streetOne: String;
        streetTwo?: String;
        city: String;
        postcode: String;
        state: String;
        country: String;
    };
}

export interface CreateUserResponse {
    id: Number;
    name: String;
    email: String;
    password: String;
    phone: Number;
    address: {
        streetOne: String;
        streetTwo?: String;
        city: String;
        postcode: String;
        state: String;
        country: String;
    };
    dateRegistered: Date;
}
