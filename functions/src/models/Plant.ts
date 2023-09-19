import { ObjectId } from "mongodb";

export default interface Plant {
  _id?: ObjectId;
  googleId: string;
  nickName: string;
  watering: number;
  pic?: string;
}
