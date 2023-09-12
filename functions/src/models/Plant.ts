import { ObjectId } from "mongodb";

export default interface Plant {
  _id?: ObjectId;
  googleId: string;
  nickName: string;
  commonName: string;
  watering: string;
  sunlight: string;
  pic?: string;
}
