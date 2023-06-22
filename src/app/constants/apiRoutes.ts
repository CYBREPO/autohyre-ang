class brand{
    //brand
    public static getBrandById = "brand/getBrandById";
    public static getAllBrands = "brand/getAllBrands";
    public static getAllModels = "brand/getAllModels";
    public static setBrands = "brand/setBrands";
    public static updateBrand = "brand/updateBrand";
    public static deleteBrand = "brand/deleteBrand";
    //model
    public static setModels = "brand/setModels";
    public static saveModel = "brand/saveModel";
    public static updateModel = "brand/updateModel";
    public static deleteModel = "brand/deleteModel";

}

class vehicle{
    public static getVehicle = "vehicle/getVehicle";
    public static setVehicleDetails = "vehicle/setVehicleDetails";
    public static getFilteredVehicleDetails = "vehicle/getFilteredVehicleDetails";
    public static getAdditionDetails = "vehicle/getAdditionDetails";
    public static getVehicles = "vehicle/getVehicles";
    public static deleteVehicle = "vehicle/deleteVehicle";
}
class location{
    public static getLocationVechile = "location/getLocationVechile";

}
class mail{
    public static sendMail = "email/sendemail";

}
class host{
    public static createHost = "host/createHost";
    public static getAllHost = "host/getAllHost";
    public static updateHostStatus = "host/updateHostStatus";

}
class account{
    public static login = "account/login";
    public static register = "account/register";
    public static resetPassword = "account/reset-password";
    public static updatePassword = "account/updatePassword";
    public static updateUser = "account/updateUser";
    public static getUsers = "account/getUsers";
    public static updateUserStatus = "account/updateUserStatus";
    public static deleteUser = "account/deleteUser";
    public static getCount = "account/getCount";

}
class pages{
    public static getPages = "pages/getPages";
    public static deletePages = "pages/deletePages";
    public static savePage = "pages/savePage";
    public static updatePage = "pages/updatePage";
    //our list
    public static getOurList = "pages/getOurList";
    public static saveOurLink = "pages/saveOurLink";
    public static updateOurList = "pages/updateOurList";
    //About us
    public static getAboutus = "pages/getAboutus";
    public static saveAboutus = "pages/saveAboutus";
    public static updateAboutus = "pages/updateAboutus";
    //Home
    public static getHome = "pages/getHome";
    public static saveHome = "pages/saveHome";
    public static updateHome = "pages/updateHome";

}
class teams{
    public static saveTeams = "teams/saveTeams";
    public static updateTeams = "teams/updateTeams";
    public static getTeams = "teams/getTeams";
    public static deleteTeamMember = "teams/deleteTeamMember";
    public static addUpdateTeamMember = "teams/addUpdateTeamMember";

}

export class ApiUrls{
    public static brand = brand;
    public static vehicle = vehicle;
    public static location = location;
    public static mail = mail;
    public static host = host;
    public static account = account;
    public static pages = pages;
    public static teams = teams;
}