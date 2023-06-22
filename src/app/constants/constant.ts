import { OwlOptions } from "ngx-owl-carousel-o";

export class locations {
   public static locations: Array<{ name: string, image: string, modalIds: Array<number> }> = [
      {
         name: 'Lagos',
         image: '../assets/images/Lagos.jpeg',
         modalIds: [1, 3, 4]
      },
      {
         name: 'Abuja',
         image: '../assets/images/Abuja.jpeg',
         modalIds: [1, 3, 4]
      },
      {
         name: 'Port Harcourt',
         image: '../assets/images/Portharcourt.jpeg',
         modalIds: [1, 2, 3, 4]
      },
      {
         name: 'Kano',
         image: '../assets/images/kano.jpeg',
         modalIds: [3, 4]
      },
      {
         name: 'Kaduna',
         image: '../assets/images/Kaduna.jpeg',
         modalIds: [1]
      },
      {
         name: 'Edo',
         image: '../assets/images/Edo.jpeg',
         modalIds: [1, 2]
      },
   ];


}

export class vehicleModels {
   public static vehicleModels: Array<{ id: number, brand: string, model: any, description: string, buttonText: string, img: string}> = [
      {
         id: 1,
         brand: 'Toyota',
         description: 'Some quick example text to build on the card brand and make up the bulk of the card content',
         buttonText: 'Button',
         img: '../assets/images/toyota.jpg',
         model: [{ name: 'innova', img: '../assets/images/toyota.jpg', price: 27, rating: 5 }, { name: 'innova', img: '../assets/images/toyota.jpg', price: 27, rating: 5 }, { name: 'innova', img: '../assets/images/toyota.jpg', price: 27, rating: 5 }, { name: 'innova', img: '../assets/images/toyota.jpg', price: 27, rating: 5 }],

      },
      {
         id: 2,
         brand: 'Mercedes Benz',
         description: 'Some quick example text to build on the card brand and make up the bulk of the card content',
         buttonText: 'Button',
         img: '../assets/images/mercedes.jpg',
         model: [{ name: 'mercedes-benz 280s', img: '../assets/images/mercedes.jpg', price: 27, rating: 5 }, { name: 'mercedes-benz 180s', img: '../assets/images/mercedes.jpg', price: 27, rating: 5 }, { name: 'mercedes-benz 380s', img: '../assets/images/mercedes.jpg', price: 27, rating: 5 }],

      },
      {
         id: 3,
         brand: 'Infiniti',
         description: 'Some quick example text to build on the card brand and make up the bulk of the card content',
         buttonText: 'Button',
         img: '../assets/images/infiniti.jpg',
         model: [{ name: 'Q50', img: '../assets/images/infiniti.jpg', price: 27, rating: 5 }, { name: 'QX60', img: '../assets/images/infiniti.jpg', price: 27, rating: 5 }, { name: 'Q60', img: '../assets/images/infiniti.jpg', price: 27, rating: 5 }, { name: 'QX50', img: '../assets/images/infiniti.jpg', price: 27, rating: 5 }],

      },
      {
         id: 4,
         brand: 'Acura',
         description: 'Some quick example text to build on the card brand and make up the bulk of the card content',
         buttonText: 'Button',
         img: '../assets/images/acura.jpg',
         model: [{ name: 'Acura TLX', img:  '../assets/images/acura.jpg', price: 27, rating: 5 }, { name: 'Acura RDX', img:  '../assets/images/acura.jpg', price: 27, rating: 5 }, { name: 'Acura ILX', img:  '../assets/images/acura.jpg', price: 27, rating: 5 }, { name: 'Mdx', img:  '../assets/images/acura.jpg', price: 27, rating: 5 }],
      },

   ];
  
}

export class fuel{
   public static fuelUnits: Array<{unit: string, label: string}> = [
      {unit: 'MPG', label: "MILES PER GALLON"}
   ]

   public static fuelTypes: Array<{label: string, value: string}> = [
      {label: "GAS", value: "GASOLINE"},
      {label: "DIESEL", value: "DIESEL"},
   ]
}

export class Pagination {
   public static PageSize = 20;
   public static PageSizeOptions: Array<{ "key": number, "value": number }> =
       [
           { "key": 20, "value": 20 },
           { "key": 40, "value": 40 },
           { "key": 60, "value": 60 },
           { "key": 80, "value": 80 },
           { "key": 100, "value": 100 }
       ];
}

export class GridColumnType {
   public static DATA = "DATA";
   public static ACTION = "ACTION";
   public static SELECT = "SELECT";
   public static EDITOR = "EDITOR";
}

export class GridColumnDataType {
   public static TEXT = "TEXT";
   public static DATE = "DATE";
   public static DATETIME = "DATETIME";
   public static TIME = "TIME";
}

export class GridActionType {
   public static BUTTON = "BUTTON";
   public static ICON = "ICON";
}

export class Carousel {
   public static customOptions: OwlOptions = {
      loop: true,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['', ''],
      responsive: {
        0: {
          items: 1
        },
        400: {
          items: 2
        },
        740: {
          items: 3
        },
        940: {
          items: 4
        }
      },
      nav: true
    }
    public static customHomeOptions: OwlOptions = {
      loop: true,
      autoplay: true,
      center: true,
      dots: false,
      autoHeight: true,
      autoWidth: true,
      // nav:true,
      navText: ['next','prev'],
    }
}

