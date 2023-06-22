export interface ILocation {
    "address": string,
     "addressLines": [string],
     "city": string,
     "country": string,
     "latitude": Number,
     "locationSource": string,
     "longitude": Number,
     "precision": {
                "accuracy": Number,
                "level": string
            },
     "state": string,
     "postalCode": string,
     "timeZone": string
}